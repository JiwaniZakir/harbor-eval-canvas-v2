'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from './_helpers';
import { createRubricSchema } from '@/lib/validation/eval';
import type { ActionResult } from './types';
import type { RubricScorerConfig } from '@/lib/eval/executor';
import { z } from 'zod';

export interface RubricRow {
  id: string;
  project_id: string;
  domain_id: string | null;
  name: string;
  description: string | null;
  scorers: RubricScorerConfig[];
  created_at: string;
  updated_at: string;
}

interface RubricScorerRow {
  id: string;
  rubric_id: string;
  scorer_type: string;
  weight: number;
  config: Record<string, unknown>;
  position: number;
}

function rowToConfig(r: RubricScorerRow): RubricScorerConfig {
  return {
    scorerId: r.scorer_type,
    weight: Number(r.weight),
    config: r.config,
    threshold: typeof r.config?.threshold === 'number' ? (r.config.threshold as number) : undefined,
  };
}

export async function listRubrics(projectId: string): Promise<ActionResult<RubricRow[]>> {
  const { supabase } = await requireUser();
  try {
    const { data, error } = await supabase
      .from('rubrics')
      .select('*, rubric_scorers(*)')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    const rows = (data ?? []).map((d: Record<string, unknown>) => ({
      id: d.id as string,
      project_id: d.project_id as string,
      domain_id: (d.domain_id as string) ?? null,
      name: d.name as string,
      description: (d.description as string) ?? null,
      created_at: d.created_at as string,
      updated_at: d.updated_at as string,
      scorers: Array.isArray(d.rubric_scorers)
        ? (d.rubric_scorers as RubricScorerRow[])
            .sort((a, b) => a.position - b.position)
            .map(rowToConfig)
        : [],
    }));
    return { ok: true, data: rows };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function getRubricScorers(
  rubricId: string,
): Promise<ActionResult<RubricScorerConfig[]>> {
  const { supabase } = await requireUser();
  try {
    const { data, error } = await supabase
      .from('rubric_scorers')
      .select('*')
      .eq('rubric_id', rubricId)
      .order('position', { ascending: true });
    if (error) throw error;
    return { ok: true, data: (data ?? []).map((r) => rowToConfig(r as RubricScorerRow)) };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function createRubric(
  input: z.infer<typeof createRubricSchema>,
): Promise<ActionResult<RubricRow>> {
  const parsed = createRubricSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  const { supabase, user } = await requireUser();
  try {
    const { data: rubric, error } = await supabase
      .from('rubrics')
      .insert({
        project_id: parsed.data.projectId,
        domain_id: parsed.data.domainId ?? null,
        name: parsed.data.name,
        created_by: user.id,
      })
      .select('*')
      .single();
    if (error) throw error;

    const scorerRows = parsed.data.scorers.map((s, i) => ({
      rubric_id: rubric.id,
      scorer_type: s.scorerId,
      weight: s.weight,
      config: { ...(s.config ?? {}), ...(s.threshold != null ? { threshold: s.threshold } : {}) },
      position: i,
    }));
    if (scorerRows.length) {
      const { error: sErr } = await supabase.from('rubric_scorers').insert(scorerRows);
      if (sErr) throw sErr;
    }

    revalidatePath('/');
    return {
      ok: true,
      data: {
        ...(rubric as Omit<RubricRow, 'scorers'>),
        scorers: parsed.data.scorers,
      } as RubricRow,
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteRubric(rubricId: string): Promise<ActionResult<null>> {
  const { supabase } = await requireUser();
  try {
    const { error } = await supabase.from('rubrics').delete().eq('id', rubricId);
    if (error) throw error;
    revalidatePath('/');
    return { ok: true, data: null };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
