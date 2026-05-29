import { z } from 'zod';

export const SCORER_IDS = ['exact_match', 'contains', 'regex', 'json_schema', 'llm_judge'] as const;

export const datasetCaseSchema = z.object({
  input: z.string().min(1),
  expected: z.string().optional(),
  metadata: z.record(z.string(), z.unknown()).optional(),
});

export const createDatasetSchema = z.object({
  projectId: z.string().uuid(),
  name: z.string().min(1).max(200),
  description: z.string().max(2000).optional(),
  cases: z.array(datasetCaseSchema).default([]),
});

export const addCasesSchema = z.object({
  datasetId: z.string().uuid(),
  cases: z.array(datasetCaseSchema).min(1),
});

export const rubricScorerSchema = z.object({
  scorerId: z.enum(SCORER_IDS),
  weight: z.number().positive().default(1),
  threshold: z.number().min(0).max(1).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
});

export const createRubricSchema = z.object({
  projectId: z.string().uuid(),
  domainId: z.string().uuid().optional(),
  name: z.string().min(1).max(200),
  scorers: z.array(rubricScorerSchema).min(1),
});

export const startRunSchema = z.object({
  projectId: z.string().uuid(),
  datasetId: z.string().uuid(),
  rubricId: z.string().uuid(),
  domainId: z.string().uuid().optional(),
  models: z.array(z.string().min(1)).min(1),
  isBaseline: z.boolean().optional(),
});
