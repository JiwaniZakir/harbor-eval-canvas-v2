import { describe, it, expect, beforeAll } from 'vitest';
import { executeRun, evaluateResponse, summarize, type Rubric } from './executor';

beforeAll(() => {
  process.env.EVAL_FAKE_MODEL = '1';
});

const rubric: Rubric = {
  scorers: [
    { scorerId: 'contains', weight: 1 },
    { scorerId: 'exact_match', weight: 1 },
  ],
};

describe('evaluateResponse', () => {
  it('scores a perfect match at 1.0 and passes', async () => {
    const r = await evaluateResponse(
      { scorers: [{ scorerId: 'exact_match', weight: 1 }] },
      { input: 'q', expected: 'hello' },
      'hello',
    );
    expect(r.score).toBe(1);
    expect(r.passed).toBe(true);
  });

  it('weights multiple scorers into an aggregate', async () => {
    const r = await evaluateResponse(rubric, { input: 'q', expected: 'world' }, 'the world is round');
    // contains -> 1, exact_match -> 0  =>  weighted avg 0.5
    expect(r.score).toBeCloseTo(0.5, 5);
    expect(r.breakdown).toHaveLength(2);
  });
});

describe('executeRun (fake model)', () => {
  it('runs all cases, persists nothing, returns a summary', async () => {
    const cases = [
      { id: 'a', input: 'one', expected: 'FAKE' },
      { id: 'b', input: 'two', expected: 'FAKE' },
      { id: 'c', input: 'three', expected: 'FAKE' },
    ];
    const { results, summary } = await executeRun(
      { scorers: [{ scorerId: 'contains', weight: 1 }] },
      cases,
      'gemini-2.5-flash',
      { concurrency: 2 },
    );
    expect(results).toHaveLength(3);
    expect(summary.total).toBe(3);
    // fake response is "FAKE_RESPONSE: ..." so contains "FAKE" -> all pass
    expect(summary.passed).toBe(3);
    expect(summary.passRate).toBe(1);
    expect(results.every((r) => r.response.startsWith('FAKE_RESPONSE'))).toBe(true);
  });

  it('summarize computes averages', () => {
    const s = summarize([
      { score: 1, passed: true, latencyMs: 10, costUsd: 0 } as never,
      { score: 0, passed: false, latencyMs: 20, costUsd: 0 } as never,
    ]);
    expect(s.avgScore).toBe(0.5);
    expect(s.passRate).toBe(0.5);
    expect(s.avgLatencyMs).toBe(15);
  });
});
