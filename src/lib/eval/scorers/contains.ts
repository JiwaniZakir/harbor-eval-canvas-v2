import { type Scorer, type ScoreResult } from './types';

/* contains: response must contain the expected substring (or all of a list of
   required substrings). Score = fraction of required substrings present. */

export interface ContainsConfig {
  caseSensitive?: boolean;
  /** Optional explicit substrings; defaults to [expected]. */
  substrings?: string[];
  /** 'all' (default) => every substring must appear; 'any' => at least one. */
  mode?: 'all' | 'any';
}

export function containsScorer(config: ContainsConfig = {}): Scorer {
  return {
    name: 'contains',
    label: 'Contains',
    async score(_input, expected, response): Promise<ScoreResult> {
      const needles = (config.substrings?.length ? config.substrings : [expected])
        .filter((s) => s.length > 0);
      if (needles.length === 0) {
        return { score: 1, passed: true, rationale: 'No substring requirement; trivially passes.' };
      }
      const hay = config.caseSensitive ? response : response.toLowerCase();
      const hits = needles.filter((n) =>
        hay.includes(config.caseSensitive ? n : n.toLowerCase()),
      );
      const fraction = hits.length / needles.length;
      const passed = config.mode === 'any' ? hits.length > 0 : hits.length === needles.length;
      return {
        score: passed ? 1 : fraction,
        passed,
        rationale: `${hits.length}/${needles.length} required substring(s) present.`,
      };
    },
  };
}
