/**
 * LLM-as-judge scoring (D2 / #87) — backs the llm_judge scorer.
 *
 * Asks Gemini to grade a response against the expected answer and/or criteria,
 * returning a normalized 0..1 score plus a rationale. Honors EVAL_FAKE_MODEL.
 */
import { getGeminiModel } from '@/lib/gemini';
import { isFakeModel } from './model';
import type { ScoreResult } from './scorers/types';

export interface JudgeArgs {
  input: string;
  expected?: string;
  response: string;
  criteria?: string;
}

const JUDGE_PROMPT = (a: JudgeArgs) => `You are a strict, fair evaluator of AI model outputs.

TASK / INPUT:
${a.input}

${a.expected ? `REFERENCE / EXPECTED ANSWER:\n${a.expected}\n` : ''}
${a.criteria ? `GRADING CRITERIA:\n${a.criteria}\n` : ''}
MODEL RESPONSE TO GRADE:
${a.response}

Grade the model response from 0.0 (completely wrong/unhelpful) to 1.0 (fully correct and excellent).
Respond ONLY with strict JSON: {"score": <number 0..1>, "rationale": "<one or two sentences>"}`;

export async function judgeWithGemini(args: JudgeArgs): Promise<ScoreResult> {
  if (isFakeModel()) {
    // Deterministic: pass if response non-empty and (no expected OR overlaps expected).
    const ok =
      args.response.trim().length > 0 &&
      (!args.expected ||
        args.response.toLowerCase().includes(args.expected.toLowerCase().slice(0, 8)));
    return {
      score: ok ? 0.9 : 0.2,
      passed: ok,
      rationale: `[fake-judge] ${ok ? 'looks reasonable' : 'insufficient'}`,
    };
  }

  try {
    const model = getGeminiModel();
    const result = await model.generateContent(JUDGE_PROMPT(args));
    const text = result.response.text();
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) {
      return { score: 0, passed: false, rationale: 'Judge returned no parseable JSON.' };
    }
    const parsed = JSON.parse(match[0]) as { score?: number; rationale?: string };
    const score = Math.max(0, Math.min(1, Number(parsed.score ?? 0)));
    return {
      score,
      passed: score >= 0.6,
      rationale: parsed.rationale ?? 'No rationale provided.',
    };
  } catch (e) {
    return { score: 0, passed: false, rationale: `Judge error: ${String(e)}` };
  }
}
