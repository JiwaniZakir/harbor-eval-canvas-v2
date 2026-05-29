/* Scorer registry (D2). Maps a stable scorer id to a factory, and resolves a
   configured scorer instance for the run executor. */
import type { Scorer, ScorerType } from './types';
import { exactMatchScorer, type ExactMatchConfig } from './exact-match';
import { containsScorer, type ContainsConfig } from './contains';
import { regexScorer, type RegexConfig } from './regex';
import { jsonSchemaScorer, type JsonSchemaConfig } from './json-schema';
import { llmJudgeScorer, type LlmJudgeConfig } from './llm-judge';

export type ScorerConfig =
  | ExactMatchConfig
  | ContainsConfig
  | RegexConfig
  | JsonSchemaConfig
  | LlmJudgeConfig;

const FACTORIES: Record<ScorerType, (config?: Record<string, unknown>) => Scorer> = {
  exact_match: (c) => exactMatchScorer(c as ExactMatchConfig),
  contains: (c) => containsScorer(c as ContainsConfig),
  regex: (c) => regexScorer(c as RegexConfig),
  json_schema: (c) => jsonSchemaScorer(c as JsonSchemaConfig),
  llm_judge: (c) => llmJudgeScorer(c as LlmJudgeConfig),
};

export const SCORER_LABELS: Record<ScorerType, string> = {
  exact_match: 'Exact Match',
  contains: 'Contains',
  regex: 'Regex',
  json_schema: 'JSON Schema',
  llm_judge: 'LLM Judge',
};

/** Default pass threshold per scorer (used when a rubric entry omits one). */
export const SCORER_DEFAULT_THRESHOLD: Record<ScorerType, number> = {
  exact_match: 1,
  contains: 1,
  regex: 1,
  json_schema: 1,
  llm_judge: 0.6,
};

export function getScorer(
  id: string,
  config?: Record<string, unknown>,
): Scorer | undefined {
  const factory = FACTORIES[id as ScorerType];
  return factory ? factory(config) : undefined;
}

export function getScorerThreshold(id: string): number {
  return SCORER_DEFAULT_THRESHOLD[id as ScorerType] ?? 0.5;
}

export * from './types';
