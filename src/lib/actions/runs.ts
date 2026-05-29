'use server';

import { revalidatePath } from 'next/cache';
import { requireUser } from './_helpers';
import { startRunSchema } from '@/lib/validation/eval';
import type { ActionResult } from './types';
import { executeRun, type CaseInput, type Rubric } from '@/lib/eval/executor';
import { z } from 'zod';

export interface RunRow {
  id: string;
  project_id: string;
  domain_id: string | null;
  dataset_id: string | null;
  rubric_id: string | null;
  model: string;
  status: 'queued' | 'running' | 'completed' | 'failed' | 'canceled';
  is_baseline: boolean;
  summary: Record<string, unknown>;
  total_cases: number;
  completed_cases: number;
  error: string | null;
  created_at: string;
  completed_at: string | null;
}

export interface RunCaseRow {
  id: string;
  run_id: string;
  dataset_case_id: string | null;
  input: string;
  response: string | null;
  score: number | null;
  passed: boolean | null;
  latency_ms: number | null;
  cost_usd: number | null;
  scorer_rationale: string | null;
}

export async function listRuns(projectId: string): Promise<ActionResult<RunRow[]>> {
  const { supabase } = await requireUser();
  try {
    const { data, error } = await supabase
      .from('runs')
      .select('*')
      .eq('project_id', projectId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as RunRow[] };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function getRunCases(runId: string): Promise<ActionResult<RunCaseRow[]>> {
  const { supabase } = await requireUser();
  try {
    const { data, error } = await supabase
      .from('run_cases')
      .select('*')
      .eq('run_id', runId)
      .order('created_at', { ascending: true });
    if (error) throw error;
    return { ok: true, data: (data ?? []) as RunCaseRow[] };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function setBaseline(runId: string, isBaseline: boolean): Promise<ActionResult> {
  const { supabase } = await requireUser();
  try {
    const { error } = await supabase.from('runs').update({ is_baseline: isBaseline }).eq('id', runId);
    if (error) throw error;
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

export async function cancelRun(runId: string): Promise<ActionResult> {
  const { supabase } = await requireUser();
  try {
    const { error } = await supabase
      .from('runs')
      .update({ status: 'canceled', completed_at: new Date().toISOString() })
      .eq('id', runId)
      .in('status', ['queued', 'running']);
    if (error) throw error;
    revalidatePath('/');
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/**
 * Start + execute an evaluation run for one or more models (D4/D5/D8).
 * Executes server-side; per-case results + progress are persisted as they
 * complete so the UI can poll runs.completed_cases / total_cases.
 * Returns the created run ids (one per model).
 */
export async function startRun(
  input: z.infer<typeof startRunSchema>,
): Promise<ActionResult<{ runIds: string[] }>> {
  const parsed = startRunSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.message };
  const { supabase, user } = await requireUser();

  try {
    // Load rubric + cases once.
    const { data: rubricRow, error: rErr } = await supabase
      .from('rubrics')
      .select('scorers')
      .eq('id', parsed.data.rubricId)
      .single();
    if (rErr || !rubricRow) throw rErr ?? new Error('Rubric not found');
    const rubric: Rubric = { scorers: rubricRow.scorers };

    const { data: caseRows, error: cErr } = await supabase
      .from('dataset_cases')
      .select('id, input, expected')
      .eq('dataset_id', parsed.data.datasetId);
    if (cErr) throw cErr;
    const cases: CaseInput[] = (caseRows ?? []).map((c) => ({
      id: c.id,
      input: c.input,
      expected: c.expected ?? undefined,
    }));
    if (!cases.length) throw new Error('Dataset has no cases');

    const runIds: string[] = [];

    for (const model of parsed.data.models) {
      const { data: run, error: runErr } = await supabase
        .from('runs')
        .insert({
          project_id: parsed.data.projectId,
          domain_id: parsed.data.domainId ?? null,
          dataset_id: parsed.data.datasetId,
          rubric_id: parsed.data.rubricId,
          model,
          status: 'running',
          is_baseline: parsed.data.isBaseline ?? false,
          total_cases: cases.length,
          completed_cases: 0,
          created_by: user.id,
        })
        .select('id')
        .single();
      if (runErr || !run) throw runErr ?? new Error('Failed to create run');
      runIds.push(run.id);

      try {
        const { summary } = await executeRun(rubric, cases, model, {
          concurrency: 4,
          onCaseDone: async (result, completed) => {
            await supabase.from('run_cases').insert({
              run_id: run.id,
              dataset_case_id: result.caseId ?? null,
              input: result.input,
              response: result.response,
              score: result.score,
              passed: result.passed,
              latency_ms: result.latencyMs,
              cost_usd: result.costUsd,
              scorer_rationale: result.rationale,
            });
            await supabase.from('runs').update({ completed_cases: completed }).eq('id', run.id);
          },
        });

        await supabase
          .from('runs')
          .update({
            status: 'completed',
            summary,
            completed_at: new Date().toISOString(),
          })
          .eq('id', run.id);
      } catch (execErr) {
        await supabase
          .from('runs')
          .update({
            status: 'failed',
            error: (execErr as Error).message,
            completed_at: new Date().toISOString(),
          })
          .eq('id', run.id);
      }
    }

    revalidatePath('/');
    return { ok: true, data: { runIds } };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}

/** Regression diff vs the project's baseline run (D6). */
export async function regressionVsBaseline(
  runId: string,
): Promise<ActionResult<{ regressions: number; improvements: number; deltaAvg: number }>> {
  const { supabase } = await requireUser();
  try {
    const { data: run } = await supabase.from('runs').select('*').eq('id', runId).single();
    if (!run) throw new Error('Run not found');
    const { data: baseline } = await supabase
      .from('runs')
      .select('*')
      .eq('project_id', run.project_id)
      .eq('is_baseline', true)
      .neq('id', runId)
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();
    if (!baseline) throw new Error('No baseline run set for this project');

    const [{ data: cur }, { data: base }] = await Promise.all([
      supabase.from('run_cases').select('dataset_case_id, score').eq('run_id', runId),
      supabase.from('run_cases').select('dataset_case_id, score').eq('run_id', baseline.id),
    ]);

    const baseMap = new Map((base ?? []).map((c) => [c.dataset_case_id, c.score ?? 0]));
    let regressions = 0;
    let improvements = 0;
    let deltaSum = 0;
    let n = 0;
    for (const c of cur ?? []) {
      if (!baseMap.has(c.dataset_case_id)) continue;
      const delta = (c.score ?? 0) - (baseMap.get(c.dataset_case_id) ?? 0);
      deltaSum += delta;
      n++;
      if (delta < -0.001) regressions++;
      else if (delta > 0.001) improvements++;
    }
    return {
      ok: true,
      data: { regressions, improvements, deltaAvg: n ? deltaSum / n : 0 },
    };
  } catch (e) {
    return { ok: false, error: (e as Error).message };
  }
}
