/**
 * Rubric evaluation (D3 / #88) + run executor (D4, D8 / #89, #93).
 *
 * A rubric is a weighted set of scorers. Evaluating a case runs every scorer,
 * computes the weighted aggregate score in [0,1], and decides pass/fail by the
 * weighted mean meeting the average per-scorer threshold.
 */
import { getScorer, getScorerThreshold } from './scorers';
import type { ScoreResult } from './scorers/types';
import { callModel, type ModelCallResult } from './model';

export interface RubricScorerConfig {
  scorerId: string;
  weight: number;
  threshold?: number;
  config?: Record<string, unknown>;
}

export interface Rubric {
  scorers: RubricScorerConfig[];
}

export interface CaseInput {
  id?: string;
  input: string;
  expected?: string;
}

export interface ScorerBreakdown extends ScoreResult {
  scorerId: string;
  weight: number;
}

export interface CaseResult {
  caseId?: string;
  input: string;
  expected?: string;
  response: string;
  score: number;
  passed: boolean;
  latencyMs: number;
  costUsd: number;
  inputTokens: number;
  outputTokens: number;
  rationale: string;
  breakdown: ScorerBreakdown[];
}

/** Evaluate a single already-produced response against a rubric. */
export async function evaluateResponse(
  rubric: Rubric,
  caseInput: CaseInput,
  response: string,
): Promise<{ score: number; passed: boolean; rationale: string; breakdown: ScorerBreakdown[] }> {
  const breakdown: ScorerBreakdown[] = [];
  let weightedSum = 0;
  let totalWeight = 0;

  for (const sc of rubric.scorers) {
    const scorer = getScorer(sc.scorerId, sc.config);
    if (!scorer) continue;
    const weight = sc.weight > 0 ? sc.weight : 1;
    const result = await scorer.score(caseInput.input, caseInput.expected ?? '', response);
    breakdown.push({ ...result, scorerId: sc.scorerId, weight });
    weightedSum += result.score * weight;
    totalWeight += weight;
  }

  const score = totalWeight > 0 ? weightedSum / totalWeight : 0;
  const avgThreshold =
    rubric.scorers.reduce(
      (acc, sc) => acc + (sc.threshold ?? getScorerThreshold(sc.scorerId)),
      0,
    ) / Math.max(1, rubric.scorers.length);
  const passed = score >= avgThreshold;

  const rationale = breakdown
    .map((b) => `${b.scorerId}: ${b.score.toFixed(2)}${b.rationale ? ` (${b.rationale})` : ''}`)
    .join(' | ');

  return { score, passed, rationale, breakdown };
}

/** Run the model on a case, then score it. */
export async function runCase(
  rubric: Rubric,
  caseInput: CaseInput,
  model: string,
): Promise<CaseResult> {
  const call: ModelCallResult = await callModel(caseInput.input, model);
  const evald = await evaluateResponse(rubric, caseInput, call.response);
  return {
    caseId: caseInput.id,
    input: caseInput.input,
    expected: caseInput.expected,
    response: call.response,
    score: evald.score,
    passed: evald.passed,
    latencyMs: call.latencyMs,
    costUsd: call.costUsd,
    inputTokens: call.inputTokens,
    outputTokens: call.outputTokens,
    rationale: evald.rationale,
    breakdown: evald.breakdown,
  };
}

export interface RunSummary {
  total: number;
  passed: number;
  failed: number;
  passRate: number;
  avgScore: number;
  avgLatencyMs: number;
  totalCostUsd: number;
}

export function summarize(results: CaseResult[]): RunSummary {
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const avgScore = total ? results.reduce((a, r) => a + r.score, 0) / total : 0;
  const avgLatencyMs = total ? results.reduce((a, r) => a + r.latencyMs, 0) / total : 0;
  const totalCostUsd = results.reduce((a, r) => a + r.costUsd, 0);
  return {
    total,
    passed,
    failed: total - passed,
    passRate: total ? passed / total : 0,
    avgScore,
    avgLatencyMs,
    totalCostUsd,
  };
}

/**
 * Execute a rubric over a list of cases with bounded concurrency.
 * onCaseDone is invoked after each case completes (for the run queue / D8).
 */
export async function executeRun(
  rubric: Rubric,
  cases: CaseInput[],
  model: string,
  opts: {
    concurrency?: number;
    onCaseDone?: (result: CaseResult, completed: number, total: number) => Promise<void> | void;
    signal?: { canceled: boolean };
  } = {},
): Promise<{ results: CaseResult[]; summary: RunSummary }> {
  const concurrency = Math.max(1, opts.concurrency ?? 4);
  const results: CaseResult[] = [];
  let cursor = 0;
  let completed = 0;

  async function worker() {
    while (cursor < cases.length) {
      if (opts.signal?.canceled) return;
      const idx = cursor++;
      const result = await runCase(rubric, cases[idx], model);
      results[idx] = result;
      completed++;
      if (opts.onCaseDone) await opts.onCaseDone(result, completed, cases.length);
    }
  }

  await Promise.all(
    Array.from({ length: Math.min(concurrency, cases.length) }, worker),
  );
  const filtered = results.filter(Boolean);
  return { results: filtered, summary: summarize(filtered) };
}
