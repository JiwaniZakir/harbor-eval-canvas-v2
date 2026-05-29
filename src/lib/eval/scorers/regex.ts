import { type Scorer, type ScoreResult } from './types';

/* regex: response must match a configured regular expression. Falls back to
   treating `expected` as the pattern when no pattern is configured. */

export interface RegexConfig {
  pattern?: string;
  flags?: string;
}

export function regexScorer(config: RegexConfig = {}): Scorer {
  return {
    name: 'regex',
    label: 'Regex',
    async score(_input, expected, response): Promise<ScoreResult> {
      const source = config.pattern ?? expected;
      if (!source) {
        return { score: 0, passed: false, rationale: 'No regex pattern configured.' };
      }
      let re: RegExp;
      try {
        re = new RegExp(source, config.flags ?? '');
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        return { score: 0, passed: false, rationale: `Invalid regex: ${msg}` };
      }
      const matched = re.test(response);
      return {
        score: matched ? 1 : 0,
        passed: matched,
        rationale: matched
          ? `Response matches /${source}/${config.flags ?? ''}.`
          : `Response does not match /${source}/${config.flags ?? ''}.`,
      };
    },
  };
}
