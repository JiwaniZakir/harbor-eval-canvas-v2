import { type Scorer, type ScoreResult } from './types';
import { judgeWithGemini } from '../judge';

/* llm-judge: defer to Gemini (or the fake judge under EVAL_FAKE_MODEL) to grade
   the response against the expected answer. Always returns a rationale. */

export interface LlmJudgeConfig {
  /** Optional extra grading criteria appended to the judge prompt. */
  criteria?: string;
}

export function llmJudgeScorer(config: LlmJudgeConfig = {}): Scorer {
  return {
    name: 'llm_judge',
    label: 'LLM Judge',
    async score(input, expected, response): Promise<ScoreResult> {
      return judgeWithGemini({ input, expected, response, criteria: config.criteria });
    },
  };
}
