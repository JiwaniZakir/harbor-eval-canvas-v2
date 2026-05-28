'use server';

/* ================================================================
   C6: Project export / import.

   Export bundles a project with its domains, datasets (+ cases) and
   runs (+ cases) into a versioned, self-contained JSON document.
   Import recreates the whole tree into the signed-in user's org,
   generating fresh ids and remapping foreign keys.

   Everything runs through the SSR client so RLS scopes reads to
   projects the user can access and writes to their own org.
   ================================================================ */

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import type { ActionResult } from './types';
import { EXPORT_VERSION, type ProjectExport } from '@/lib/export-format';

// --- Export document shape ---------------------------------------------------
// Export
// =============================================================================

export async function exportProject(
  projectId: string,
): Promise<ActionResult<ProjectExport>> {
  if (!z.uuid().safeParse(projectId).success) {
    return { ok: false, error: 'Invalid project id' };
  }
  const supabase = await createClient();

  const { data: project, error: pErr } = await supabase
    .from('projects')
    .select('*')
    .eq('id', projectId)
    .maybeSingle();
  if (pErr) return { ok: false, error: pErr.message };
  if (!project) return { ok: false, error: 'Project not found' };

  const [domainsRes, datasetsRes, runsRes] = await Promise.all([
    supabase.from('domains').select('*').eq('project_id', projectId),
    supabase.from('datasets').select('*').eq('project_id', projectId),
    supabase.from('runs').select('*').eq('project_id', projectId),
  ]);
  if (domainsRes.error) return { ok: false, error: domainsRes.error.message };
  if (datasetsRes.error) return { ok: false, error: datasetsRes.error.message };
  if (runsRes.error) return { ok: false, error: runsRes.error.message };

  const datasetIds = (datasetsRes.data ?? []).map((d) => d.id);
  const runIds = (runsRes.data ?? []).map((r) => r.id);
  const domainIdToKey = new Map<string, string>(
    (domainsRes.data ?? []).map((d) => [d.id, d.domain_key]),
  );

  const [casesRes, runCasesRes] = await Promise.all([
    datasetIds.length
      ? supabase.from('dataset_cases').select('*').in('dataset_id', datasetIds)
      : Promise.resolve({ data: [], error: null }),
    runIds.length
      ? supabase.from('run_cases').select('*').in('run_id', runIds)
      : Promise.resolve({ data: [], error: null }),
  ]);
  if (casesRes.error) return { ok: false, error: casesRes.error.message };
  if (runCasesRes.error) return { ok: false, error: runCasesRes.error.message };

  const casesByDataset = new Map<string, typeof casesRes.data>();
  for (const c of casesRes.data ?? []) {
    const arr = casesByDataset.get(c.dataset_id) ?? [];
    arr.push(c);
    casesByDataset.set(c.dataset_id, arr);
  }
  const runCasesByRun = new Map<string, typeof runCasesRes.data>();
  for (const rc of runCasesRes.data ?? []) {
    const arr = runCasesByRun.get(rc.run_id) ?? [];
    arr.push(rc);
    runCasesByRun.set(rc.run_id, arr);
  }

  const doc: ProjectExport = {
    version: EXPORT_VERSION,
    exportedAt: new Date().toISOString(),
    project: {
      name: project.name,
      description: project.description ?? null,
      targetModel: project.target_model ?? null,
      workflowDescription: project.workflow_description ?? null,
      globalProgress: project.global_progress ?? 0,
    },
    domains: (domainsRes.data ?? []).map((d) => ({
      domainKey: d.domain_key,
      status: d.status ?? null,
      progress: d.progress ?? 0,
      artifacts: d.artifacts ?? [],
      probeSummary: d.probe_summary ?? null,
      scaffoldAgents: d.scaffold_agents ?? null,
      validationGates: d.validation_gates ?? null,
      sweepSummary: d.sweep_summary ?? null,
    })),
    datasets: (datasetsRes.data ?? []).map((ds) => ({
      refId: ds.id,
      name: ds.name,
      cases: (casesByDataset.get(ds.id) ?? []).map((c) => ({
        input: c.input ?? null,
        expected: c.expected ?? null,
        metadata: c.metadata ?? null,
      })),
    })),
    runs: (runsRes.data ?? []).map((r) => ({
      domainKey: r.domain_id ? domainIdToKey.get(r.domain_id) ?? null : null,
      datasetRefId: r.dataset_id ?? null,
      model: r.model ?? null,
      status: r.status ?? null,
      isBaseline: r.is_baseline ?? false,
      summary: r.summary ?? null,
      cases: (runCasesByRun.get(r.id) ?? []).map((rc) => ({
        input: rc.input ?? null,
        response: rc.response ?? null,
        score: rc.score ?? null,
        passed: rc.passed ?? null,
        latencyMs: rc.latency_ms ?? null,
        costUsd: rc.cost_usd ?? null,
        scorerRationale: rc.scorer_rationale ?? null,
      })),
    })),
  };

  return { ok: true, data: doc };
}

// =============================================================================
// Import
// =============================================================================

const importSchema = z.object({
  version: z.number(),
  exportedAt: z.string().optional(),
  project: z.object({
    name: z.string().min(1),
    description: z.string().nullable().optional(),
    targetModel: z.unknown().optional(),
    workflowDescription: z.string().nullable().optional(),
    globalProgress: z.number().optional(),
  }),
  domains: z.array(z.object({
    domainKey: z.string(),
    status: z.string().nullable().optional(),
    progress: z.number().optional(),
    artifacts: z.unknown().optional(),
    probeSummary: z.unknown().optional(),
    scaffoldAgents: z.unknown().optional(),
    validationGates: z.unknown().optional(),
    sweepSummary: z.unknown().optional(),
  })).default([]),
  datasets: z.array(z.object({
    refId: z.string(),
    name: z.string(),
    cases: z.array(z.object({
      input: z.string().nullable().optional(),
      expected: z.string().nullable().optional(),
      metadata: z.unknown().optional(),
    })).default([]),
  })).default([]),
  runs: z.array(z.object({
    domainKey: z.string().nullable().optional(),
    datasetRefId: z.string().nullable().optional(),
    model: z.string().nullable().optional(),
    status: z.string().nullable().optional(),
    isBaseline: z.boolean().optional(),
    summary: z.unknown().optional(),
    cases: z.array(z.object({
      input: z.string().nullable().optional(),
      response: z.string().nullable().optional(),
      score: z.number().nullable().optional(),
      passed: z.boolean().nullable().optional(),
      latencyMs: z.number().nullable().optional(),
      costUsd: z.number().nullable().optional(),
      scorerRationale: z.string().nullable().optional(),
    })).default([]),
  })).default([]),
});

async function resolveOrgId(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<string | null> {
  const { data, error } = await supabase
    .from('org_members')
    .select('org_id, role, created_at')
    .order('created_at', { ascending: true });
  if (error || !data || data.length === 0) return null;
  const owned = data.find((m) => m.role === 'owner');
  return (owned ?? data[0]).org_id;
}

export async function importProject(
  raw: unknown,
): Promise<ActionResult<{ projectId: string }>> {
  const parsed = importSchema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: `Invalid export file: ${parsed.error.issues[0]?.message ?? 'unknown'}` };
  }
  const doc = parsed.data;
  if (doc.version !== EXPORT_VERSION) {
    return { ok: false, error: `Unsupported export version ${doc.version} (expected ${EXPORT_VERSION})` };
  }

  const supabase = await createClient();
  const orgId = await resolveOrgId(supabase);
  if (!orgId) return { ok: false, error: 'No organization found for user' };
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 1) project
  const { data: project, error: pErr } = await supabase
    .from('projects')
    .insert({
      org_id: orgId,
      name: doc.project.name,
      description: doc.project.description ?? null,
      target_model: doc.project.targetModel ?? null,
      workflow_description: doc.project.workflowDescription ?? null,
      global_progress: doc.project.globalProgress ?? 0,
      created_by: user?.id ?? null,
    })
    .select('id')
    .single();
  if (pErr || !project) return { ok: false, error: pErr?.message ?? 'Failed to create project' };
  const projectId = project.id as string;

  // 2) domains (capture id per domain_key for run re-linking)
  const domainKeyToId = new Map<string, string>();
  if (doc.domains.length) {
    const { data: domains, error: dErr } = await supabase
      .from('domains')
      .insert(doc.domains.map((d) => ({
        project_id: projectId,
        domain_key: d.domainKey,
        status: d.status ?? 'untested',
        progress: d.progress ?? 0,
        artifacts: d.artifacts ?? [],
        probe_summary: d.probeSummary ?? null,
        scaffold_agents: d.scaffoldAgents ?? null,
        validation_gates: d.validationGates ?? null,
        sweep_summary: d.sweepSummary ?? null,
      })))
      .select('id, domain_key');
    if (dErr) return { ok: false, error: dErr.message };
    for (const d of domains ?? []) domainKeyToId.set(d.domain_key, d.id);
  }

  // 3) datasets (+ cases), capture refId -> new id
  const datasetRefToId = new Map<string, string>();
  for (const ds of doc.datasets) {
    const { data: dataset, error: dsErr } = await supabase
      .from('datasets')
      .insert({ project_id: projectId, name: ds.name })
      .select('id')
      .single();
    if (dsErr || !dataset) return { ok: false, error: dsErr?.message ?? 'Failed to create dataset' };
    datasetRefToId.set(ds.refId, dataset.id);
    if (ds.cases.length) {
      const { error: cErr } = await supabase.from('dataset_cases').insert(
        ds.cases.map((c) => ({
          dataset_id: dataset.id,
          input: c.input ?? null,
          expected: c.expected ?? null,
          metadata: c.metadata ?? null,
        })),
      );
      if (cErr) return { ok: false, error: cErr.message };
    }
  }

  // 4) runs (+ cases) with FK remapping
  for (const run of doc.runs) {
    const { data: newRun, error: rErr } = await supabase
      .from('runs')
      .insert({
        project_id: projectId,
        domain_id: run.domainKey ? domainKeyToId.get(run.domainKey) ?? null : null,
        dataset_id: run.datasetRefId ? datasetRefToId.get(run.datasetRefId) ?? null : null,
        model: run.model ?? null,
        status: run.status ?? null,
        is_baseline: run.isBaseline ?? false,
        summary: run.summary ?? null,
        created_by: user?.id ?? null,
      })
      .select('id')
      .single();
    if (rErr || !newRun) return { ok: false, error: rErr?.message ?? 'Failed to create run' };
    if (run.cases.length) {
      const { error: rcErr } = await supabase.from('run_cases').insert(
        run.cases.map((rc) => ({
          run_id: newRun.id,
          input: rc.input ?? null,
          response: rc.response ?? null,
          score: rc.score ?? null,
          passed: rc.passed ?? null,
          latency_ms: rc.latencyMs ?? null,
          cost_usd: rc.costUsd ?? null,
          scorer_rationale: rc.scorerRationale ?? null,
        })),
      );
      if (rcErr) return { ok: false, error: rcErr.message };
    }
  }

  return { ok: true, data: { projectId } };
}
