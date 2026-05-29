import { describe, it, expect, beforeAll } from 'vitest';
import { getScorer } from './index';

beforeAll(() => {
  process.env.EVAL_FAKE_MODEL = '1';
});

describe('exact_match', () => {
  const s = getScorer('exact_match')!;
  it('passes identical (case-insensitive, trimmed)', async () => {
    expect((await s.score('q', 'Hello', '  hello ')).passed).toBe(true);
  });
  it('fails different', async () => {
    const r = await s.score('q', 'Hello', 'world');
    expect(r.passed).toBe(false);
    expect(r.score).toBe(0);
  });
});

describe('contains', () => {
  const s = getScorer('contains')!;
  it('passes when substring present', async () => {
    expect((await s.score('q', 'cat', 'the cat sat')).passed).toBe(true);
  });
  it('fails when absent', async () => {
    expect((await s.score('q', 'dog', 'the cat sat')).passed).toBe(false);
  });
});

describe('regex', () => {
  const s = getScorer('regex', { pattern: '\\d{3}-\\d{4}' })!;
  it('matches a phone pattern', async () => {
    expect((await s.score('q', '', 'call 555-1234')).passed).toBe(true);
  });
  it('rejects non-match', async () => {
    expect((await s.score('q', '', 'no number')).passed).toBe(false);
  });
});

describe('json_schema', () => {
  const schema = { type: 'object', required: ['name'], properties: { name: { type: 'string' } } };
  const s = getScorer('json_schema', { schema })!;
  it('passes valid object', async () => {
    expect((await s.score('q', '', '{"name":"Ada"}')).passed).toBe(true);
  });
  it('fails missing required key', async () => {
    const r = await s.score('q', '', '{"age":3}');
    expect(r.passed).toBe(false);
    expect(r.score).toBeLessThan(1);
  });
  it('fails invalid JSON', async () => {
    expect((await s.score('q', '', 'not json')).passed).toBe(false);
  });
});

describe('llm_judge (fake)', () => {
  const s = getScorer('llm_judge')!;
  it('passes a reasonable response', async () => {
    const r = await s.score('q', 'Paris', 'The capital is Paris.');
    expect(r.passed).toBe(true);
    expect(r.rationale).toBeTruthy();
  });
});
