import { z } from 'zod';
import { ALL_DOMAIN_IDS } from '../types';

/* ================================================================
   Validation schemas for project + domain CRUD server actions.
   These mirror the Zustand client types in src/lib/types.ts and
   the Postgres columns in the `projects` / `domains` tables.
   ================================================================ */

// --- Primitives shared with the client types ---

export const providerSchema = z.enum(['google', 'anthropic', 'openai', 'meta']);

export const targetModelSchema = z.object({
  provider: providerSchema,
  modelSlug: z.string().min(1),
  modelName: z.string().min(1),
});

export const domainIdSchema = z.enum(
  ALL_DOMAIN_IDS as [string, ...string[]],
);

export const domainStatusSchema = z.enum([
  'untested', 'probe_queued', 'probing', 'probe_complete', 'promoted',
  'redesign', 'rejected', 'scaffold_queued', 'scaffolding', 'scaffold_complete',
  'validation_gate', 'gate_passed', 'gate_failed', 'target_sweep',
  'sweep_complete', 'iterating', 'published', 'ready_to_publish',
  'calibrating', 'needs_review', 'blocked', 'archived',
]);

export const artifactSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['json', 'jsonl', 'py', 'yaml', 'yml', 'md', 'csv', 'txt']),
  size: z.number(),
  domainId: domainIdSchema,
  createdAt: z.number(),
  content: z.string().optional(),
  parentId: z.string().optional(),
});

// jsonb blobs are stored as-is. We accept the strongly-typed client objects
// (ProbeSummary, ScaffoldAgent[], etc.) without over-constraining their shape,
// since the canvas owns their structure and Postgres stores them verbatim.
export const probeSummarySchema = z.unknown();
export const scaffoldAgentsSchema = z.unknown();
export const validationGatesSchema = z.unknown();
export const sweepSummarySchema = z.unknown();

// --- Projects ---

export const createProjectSchema = z.object({
  name: z.string().min(1, 'Name is required').max(200),
  targetModel: targetModelSchema,
  workflowDescription: z.string().max(10_000).optional(),
  globalProgress: z.number().int().min(0).max(100).default(0),
});

export const updateProjectSchema = z.object({
  id: z.uuid(),
  name: z.string().min(1).max(200).optional(),
  targetModel: targetModelSchema.optional(),
  workflowDescription: z.string().max(10_000).nullable().optional(),
  globalProgress: z.number().int().min(0).max(100).optional(),
});

export const projectIdSchema = z.object({ id: z.uuid() });

// --- Domains ---

export const upsertDomainSchema = z.object({
  projectId: z.uuid(),
  domainKey: domainIdSchema,
  status: domainStatusSchema.optional(),
  progress: z.number().int().min(0).max(100).optional(),
  artifacts: z.array(artifactSchema).optional(),
  probeSummary: probeSummarySchema.nullable().optional(),
  scaffoldAgents: scaffoldAgentsSchema.nullable().optional(),
  validationGates: validationGatesSchema.nullable().optional(),
  sweepSummary: sweepSummarySchema.nullable().optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type UpsertDomainInput = z.infer<typeof upsertDomainSchema>;
