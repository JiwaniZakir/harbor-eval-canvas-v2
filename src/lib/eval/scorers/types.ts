/* ================================================================
   D2: Scorer abstraction.

   A Scorer takes (input, expected, response) and returns a normalized
   score in [0,1], a pass/fail flag, and an optional human-readable
   rationale. Scorers are pure and pluggable; the run executor (D4)
   composes weighted scorers from a rubric (D3).
   ================================================================ */

export type ScorerType =
  | 'exact_match'
  | 'contains'
  | 'regex'
  | 'json_schema'
  | 'llm_judge';

export interface ScoreResult {
  /** Normalized score in [0,1]. */
  score: number;
  /** Whether this scorer considers the response a pass. */
  passed: boolean;
  /** Optional human-readable explanation (always set for llm-judge). */
  rationale?: string;
}

export interface ScorerContext {
  input: string;
  expected: string;
}

export interface Scorer {
  /** Stable identifier, matches the DB `scorer_type`. */
  readonly name: ScorerType;
  /** Human label for UI. */
  readonly label: string;
  score(
    input: string,
    expected: string,
    response: string,
  ): Promise<ScoreResult>;
}

/** Clamp a numeric score into the valid [0,1] range. */
export function clamp01(n: number): number {
  if (Number.isNaN(n)) return 0;
  return Math.max(0, Math.min(1, n));
}
