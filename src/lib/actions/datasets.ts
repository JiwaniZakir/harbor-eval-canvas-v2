'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from './_helpers';
import { createDatasetSchema, addCasesSchema } from '@/lib/validation/eval';
import type { ActionResult } from './types';
import { z } from 'zod';

export interface DatasetRow {
  id: string;
  project_id: string;
  name: string;
  description: string | null;
  created_at: string;
  case_count?: number;
}

export interface DatasetCaseRow {
  id: string;
  dataset_id: string;
  input: string;
  expected: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export async function listDatasets(projectId: string): Promise<ActionResult<DatasetRow[]>> {
  const { supabase } = await requireUser();
  try {
    const { data, error } = await supabase
      .from('datasets')
      .select('*, dataset_cases(count)')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    const rows = (data ?? []).map((d: Record<string, unknown>) => ({
      ...(d as unknown as DatasetRow),
      case_count: Array.isArray(d.dataset_cases)
        ? (d.dataset_cases[0] as { count: number } | undefined)?.count ?? 0
        : 0,
    }));
    return { ok: true, data: rows };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function getDatasetCases(datasetId: string): Promise<ActionResult<DatasetCaseRow[]>> {
  const { supabase } = await requireUser();
  try {
    const { data, error } = await supabase
      .from('dataset_cases')
      .select('*')
      .eq('dataset_id', datasetId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as DatasetCaseRow[] };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function createDataset(
  input: z.infer<typeof createDatasetSchema>,
): Promise<ActionResult<DatasetRow>> {
  const parsed = createDatasetSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  const { supabase } = await requireUser();
  try {
    const { data: ds, error } = await supabase
      .from('datasets')
      .insert({
        project_id: parsed.data.projectId,
        name: parsed.data.name,
        description: parsed.data.description ?? null,
      })
      .select('*')
      .single();
    if (error) throw error;

    if (parsed.data.cases.length) {
      const rows = parsed.data.cases.map((c) => ({
        dataset_id: ds.id,
        input: c.input,
        expected: c.expected ?? null,
        metadata: c.metadata ?? {},
      }));
      const { error: cErr } = await supabase.from('dataset_cases').insert(rows);
      if (cErr) throw cErr;
    }
    revalidatePath('/');
    return { ok: true, data: ds as DatasetRow };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function addCases(
  input: z.infer<typeof addCasesSchema>,
): Promise<ActionResult<{ inserted: number }>> {
  const parsed = addCasesSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  const { supabase } = await requireUser();
  try {
    const rows = parsed.data.cases.map((c) => ({
      dataset_id: parsed.data.datasetId,
      input: c.input,
      expected: c.expected ?? null,
      metadata: c.metadata ?? {},
    }));
    const { error } = await supabase.from('dataset_cases').insert(rows);
    if (error) throw error;
    revalidatePath('/');
    return { ok: true, data: { inserted: rows.length } };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function deleteDataset(datasetId: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  try {
    const { error } = await supabase.from('datasets').delete().eq('id', datasetId);
    if (error) throw error;
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
