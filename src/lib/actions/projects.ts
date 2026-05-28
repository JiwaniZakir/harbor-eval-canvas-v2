'use server';

/* ================================================================
   C2: Typed, zod-validated server actions for project + domain CRUD.

   All actions run against the SSR Supabase client, so they execute as
   the authenticated user and RLS enforces org scoping. Every action
   returns a discriminated `ActionResult` so client callers (the
   write-through stores in C3/C4) can reconcile or roll back.
   ================================================================ */

import { createClient } from '@/lib/supabase/server';
import {
  createProjectSchema,
  updateProjectSchema,
  projectIdSchema,
  upsertDomainSchema,
  type CreateProjectInput,
  type UpdateProjectInput,
  type UpsertDomainInput,
} from '@/lib/validation/persistence';
import type {
  DomainId,
  DomainState,
  Project,
  TargetModel,
} from '@/lib/types';
import type { ActionResult } from './types';

// --- DB row shapes -----------------------------------------------------------

interface ProjectRow {
  id: string;
  org_id: string;
  name: string;
  target_model: TargetModel | null;
  workflow_description: string | null;
  global_progress: number;
  created_at: string;
}

interface DomainRow {
  id: string;
  project_id: string;
  domain_key: string;
  status: string | null;
  progress: number;
  artifacts: DomainState['artifacts'] | null;
  probe_summary: DomainState['probeSummary'] | null;
  scaffold_agents: DomainState['scaffoldAgents'] | null;
  validation_gates: DomainState['validationGates'] | null;
  sweep_summary: DomainState['sweepSummary'] | null;
}

// --- Mappers (DB row <-> client type) ---------------------------------------

function rowToProject(row: ProjectRow): Project {
  return {
    id: row.id,
    name: row.name,
    targetModel: row.target_model ?? {
      provider: 'google',
      modelSlug: 'gemini-2.5-pro',
      modelName: 'Gemini 2.5 Pro',
    },
    workflowDescription: row.workflow_description ?? undefined,
    globalProgress: row.global_progress ?? 0,
    createdAt: new Date(row.created_at).getTime(),
  };
}

function rowToDomainState(row: DomainRow): DomainState {
  return {
    id: row.domain_key as DomainId,
    status: (row.status ?? 'untested') as DomainState['status'],
    progress: row.progress ?? 0,
    artifacts: row.artifacts ?? [],
    probeSummary: row.probe_summary ?? undefined,
    scaffoldAgents: row.scaffold_agents ?? undefined,
    validationGates: row.validation_gates ?? undefined,
    sweepSummary: row.sweep_summary ?? undefined,
  };
}

// --- Org resolution ----------------------------------------------------------

/**
 * Resolves the authenticated user's primary (personal) org. Defaults to the
 * earliest org they own; falls back to any membership. Returns null when the
 * user has no org or is unauthenticated.
 */
async function resolveOrgId(
  supabase: Awaited<ReturnType<typeof createClient>>,
): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('org_members')
    .select('org_id, role, created_at')
    .order('created_at', { ascending: true });

  if (error || !data || data.length === 0) return null;
  const owned = data.find((m) => m.role === 'owner');
  return (owned ?? data[0]).org_id;
}

// =============================================================================
// Projects
// =============================================================================

export async function listProjects(): Promise<ActionResult<Project[]>> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data as ProjectRow[]).map(rowToProject) };
}

export async function getProject(
  id: string,
): Promise<ActionResult<{ project: Project; domains: DomainState[] }>> {
  const parsed = projectIdSchema.safeParse({ id });
  if (!parsed.success) return { ok: false, error: 'Invalid project id' };

  const supabase = await createClient();
  const { data: project, error: projErr } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (projErr) return { ok: false, error: projErr.message };
  if (!project) return { ok: false, error: 'Project not found' };

  const { data: domains, error: domErr } = await supabase
    .from('domains')
    .select('*')
    .eq('project_id', id);
  if (domErr) return { ok: false, error: domErr.message };

  return {
    ok: true,
    data: {
      project: rowToProject(project as ProjectRow),
      domains: (domains as DomainRow[]).map(rowToDomainState),
    },
  };
}

export async function createProject(
  input: CreateProjectInput,
): Promise<ActionResult<Project>> {
  const parsed = createProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const supabase = await createClient();
  const orgId = await resolveOrgId(supabase);
  if (!orgId) return { ok: false, error: 'No organization found for user' };

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from('projects')
    .insert({
      org_id: orgId,
      name: parsed.data.name,
      target_model: parsed.data.targetModel,
      workflow_description: parsed.data.workflowDescription ?? null,
      global_progress: parsed.data.globalProgress,
      created_by: user?.id ?? null,
    })
    .select('*')
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: rowToProject(data as ProjectRow) };
}

export async function updateProject(
  input: UpdateProjectInput,
): Promise<ActionResult<Project>> {
  const parsed = updateProjectSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const patch: Record<string, unknown> = {};
  if (parsed.data.name !== undefined) patch.name = parsed.data.name;
  if (parsed.data.targetModel !== undefined) patch.target_model = parsed.data.targetModel;
  if (parsed.data.workflowDescription !== undefined)
    patch.workflow_description = parsed.data.workflowDescription;
  if (parsed.data.globalProgress !== undefined)
    patch.global_progress = parsed.data.globalProgress;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('projects')
    .update(patch)
    .eq('id', parsed.data.id)
    .select('*')
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: rowToProject(data as ProjectRow) };
}

export async function deleteProject(id: string): Promise<ActionResult<{ id: string }>> {
  const parsed = projectIdSchema.safeParse({ id });
  if (!parsed.success) return { ok: false, error: 'Invalid project id' };

  const supabase = await createClient();
  const { error } = await supabase.from('projects').delete().eq('id', id);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: { id } };
}

// =============================================================================
// Domains
// =============================================================================

export async function listDomains(
  projectId: string,
): Promise<ActionResult<DomainState[]>> {
  const parsed = projectIdSchema.safeParse({ id: projectId });
  if (!parsed.success) return { ok: false, error: 'Invalid project id' };

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('domains')
    .select('*')
    .eq('project_id', projectId);
  if (error) return { ok: false, error: error.message };
  return { ok: true, data: (data as DomainRow[]).map(rowToDomainState) };
}

/**
 * Upsert a single domain row keyed by (project_id, domain_key). Used by the
 * write-through domain store for every per-domain mutation.
 */
export async function upsertDomain(
  input: UpsertDomainInput,
): Promise<ActionResult<DomainState>> {
  const parsed = upsertDomainSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? 'Invalid input' };
  }

  const d = parsed.data;
  const record: Record<string, unknown> = {
    project_id: d.projectId,
    domain_key: d.domainKey,
  };
  if (d.status !== undefined) record.status = d.status;
  if (d.progress !== undefined) record.progress = d.progress;
  if (d.artifacts !== undefined) record.artifacts = d.artifacts;
  if (d.probeSummary !== undefined) record.probe_summary = d.probeSummary;
  if (d.scaffoldAgents !== undefined) record.scaffold_agents = d.scaffoldAgents;
  if (d.validationGates !== undefined) record.validation_gates = d.validationGates;
  if (d.sweepSummary !== undefined) record.sweep_summary = d.sweepSummary;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('domains')
    .upsert(record, { onConflict: 'project_id,domain_key' })
    .select('*')
    .single();

  if (error) return { ok: false, error: error.message };
  return { ok: true, data: rowToDomainState(data as DomainRow) };
}

/**
 * Bulk-initialize all domain rows for a project (idempotent). Returns the full
 * set of domain states after the operation.
 */
export async function initializeProjectDomains(
  projectId: string,
  domainKeys: DomainId[],
): Promise<ActionResult<DomainState[]>> {
  const parsed = projectIdSchema.safeParse({ id: projectId });
  if (!parsed.success) return { ok: false, error: 'Invalid project id' };

  const rows = domainKeys.map((key) => ({
    project_id: projectId,
    domain_key: key,
    status: 'untested',
    progress: 0,
    artifacts: [],
  }));

  const supabase = await createClient();
  const { data, error } = await supabase
    .from('domains')
    .upsert(rows, { onConflict: 'project_id,domain_key', ignoreDuplicates: true })
    .select('*');
  if (error) return { ok: false, error: error.message };

  // upsert with ignoreDuplicates returns only inserted rows; re-read full set.
  return listDomains(projectId);
}
