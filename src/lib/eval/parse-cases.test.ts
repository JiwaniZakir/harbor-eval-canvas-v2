import { describe, it, expect } from 'vitest';
import { parseCasesCSV, parseCasesJSON } from './parse-cases';

describe('parseCasesCSV', () => {
  it('parses header + rows', () => {
    const cases = parseCasesCSV('input,expected\nhello,world\nfoo,bar');
    expect(cases).toEqual([
      { input: 'hello', expected: 'world' },
      { input: 'foo', expected: 'bar' },
    ]);
  });
  it('supports quoted fields with commas', () => {
    const cases = parseCasesCSV('input,expected\n"a, b","c, d"');
    expect(cases[0]).toEqual({ input: 'a, b', expected: 'c, d' });
  });
  it('throws without input column', () => {
    expect(() => parseCasesCSV('foo,bar\n1,2')).toThrow();
  });
  it('skips empty input rows', () => {
    expect(parseCasesCSV('input,expected\n,x\nok,y')).toHaveLength(1);
  });
});

describe('parseCasesJSON', () => {
  it('parses an array of cases', () => {
    const cases = parseCasesJSON('[{"input":"a","expected":"b"},{"input":"c"}]');
    expect(cases).toEqual([{ input: 'a', expected: 'b' }, { input: 'c', expected: undefined }]);
  });
  it('throws on non-array', () => {
    expect(() => parseCasesJSON('{"input":"a"}')).toThrow();
  });
  it('throws on missing input', () => {
    expect(() => parseCasesJSON('[{"expected":"b"}]')).toThrow();
  });
});
