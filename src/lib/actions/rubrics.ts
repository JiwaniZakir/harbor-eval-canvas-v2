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
  scorers: RubricScorerConfig[];
  created_at: string;
  updated_at: string;
}

export async function listRubrics(projectId: string): Promise<ActionResult<RubricRow[]>> {
  const { supabase } = await requireUser();
  try {
    const { data, error } = await supabase
      .from('rubrics')
      .select('*')
      .eq('project_id', projectId)
      .order('updated_at', { ascending: false });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as RubricRow[] };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function createRubric(
  input: z.infer<typeof createRubricSchema>,
): Promise<ActionResult<RubricRow>> {
  const parsed = createRubricSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  const { supabase } = await requireUser();
  try {
    const { data, error } = await supabase
      .from('rubrics')
      .insert({
        project_id: parsed.data.projectId,
        domain_id: parsed.data.domainId ?? null,
        name: parsed.data.name,
        scorers: parsed.data.scorers,
      })
      .select('*')
      .single();
    if (error) throw error;
    revalidatePath('/');
    return { ok: true, data: data as RubricRow };
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
