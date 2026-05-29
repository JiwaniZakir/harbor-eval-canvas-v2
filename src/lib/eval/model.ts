/**
 * Eval model client (D4 / #89).
 *
 * Wraps Gemini text generation for the run executor, with:
 *  - latency measurement
 *  - rough token + cost estimation
 *  - an EVAL_FAKE_MODEL escape hatch for deterministic, network-free runs
 *    (used by unit/E2E tests so they are not flaky or rate-limited).
 */
import { getGeminiModel, GEMINI_MODEL } from '@/lib/gemini';

export interface ModelCallResult {
  response: string;
  latencyMs: number;
  inputTokens: number;
  outputTokens: number;
  costUsd: number;
}

// Approximate gemini-2.5-flash pricing (USD per 1M tokens). Used only for an
// informational estimate; not billing.
const PRICE_PER_M_INPUT = 0.3;
const PRICE_PER_M_OUTPUT = 2.5;

function estimateTokens(text: string): number {
  // ~4 chars/token heuristic.
  return Math.max(1, Math.ceil(text.length / 4));
}

function estimateCost(inputTokens: number, outputTokens: number): number {
  return (
    (inputTokens / 1_000_000) * PRICE_PER_M_INPUT +
    (outputTokens / 1_000_000) * PRICE_PER_M_OUTPUT
  );
}

export function isFakeModel(): boolean {
  return process.env.EVAL_FAKE_MODEL === '1' || process.env.EVAL_FAKE_MODEL === 'true';
}

/** Deterministic canned response for fake mode. */
function fakeResponse(prompt: string): string {
  return `FAKE_RESPONSE: ${prompt.slice(0, 120)}`;
}

export async function callModel(
  prompt: string,
  model: string = GEMINI_MODEL,
): Promise<ModelCallResult> {
  const start = Date.now();

  if (isFakeModel()) {
    const response = fakeResponse(prompt);
    const inputTokens = estimateTokens(prompt);
    const outputTokens = estimateTokens(response);
    return {
      response,
      latencyMs: Date.now() - start,
      inputTokens,
      outputTokens,
      costUsd: 0,
    };
  }

  const m = getGeminiModel(model);
  const result = await m.generateContent(prompt);
  const response = result.response.text();
  const latencyMs = Date.now() - start;

  const usage = result.response.usageMetadata;
  const inputTokens = usage?.promptTokenCount ?? estimateTokens(prompt);
  const outputTokens = usage?.candidatesTokenCount ?? estimateTokens(response);

  return {
    response,
    latencyMs,
    inputTokens,
    outputTokens,
    costUsd: estimateCost(inputTokens, outputTokens),
  };
}
