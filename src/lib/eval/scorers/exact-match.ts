import { type Scorer, type ScoreResult } from './types';

/* exact-match: response must equal expected (optionally case/whitespace
   insensitive). Score is binary 1/0. */

export interface ExactMatchConfig {
  caseSensitive?: boolean;
  trim?: boolean;
}

function normalize(s: string, cfg: ExactMatchConfig): string {
  let out = s;
  if (cfg.trim !== false) out = out.trim();
  if (cfg.caseSensitive !== true) out = out.toLowerCase();
  return out;
}

export function exactMatchScorer(config: ExactMatchConfig = {}): Scorer {
  return {
    name: 'exact_match',
    label: 'Exact Match',
    async score(_input, expected, response): Promise<ScoreResult> {
      const match = normalize(response, config) === normalize(expected, config);
      return {
        score: match ? 1 : 0,
        passed: match,
        rationale: match
          ? 'Response exactly matches the expected value.'
          : 'Response does not match the expected value.',
      };
    },
  };
}
