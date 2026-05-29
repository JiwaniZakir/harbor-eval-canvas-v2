/** CSV / JSON parsing helpers for dataset case import (D1). */

export interface ParsedCase {
  input: string;
  expected?: string;
  metadata?: Record<string, unknown>;
}

/** Parse a simple CSV with a header row. Recognizes `input` + `expected` columns. */
export function parseCasesCSV(text: string): ParsedCase[] {
  const rows = splitCSV(text.trim());
  if (rows.length === 0) return [];
  const header = rows[0].map((h) => h.trim().toLowerCase());
  const inputIdx = header.indexOf('input');
  const expectedIdx = header.indexOf('expected');
  if (inputIdx === -1) throw new Error('CSV must have an "input" column header.');
  const cases: ParsedCase[] = [];
  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i];
    const input = (cells[inputIdx] ?? '').trim();
    if (!input) continue;
    const expected = expectedIdx >= 0 ? (cells[expectedIdx] ?? '').trim() : undefined;
    cases.push({ input, expected: expected || undefined });
  }
  return cases;
}

/** Parse a JSON array of {input, expected?, metadata?}. */
export function parseCasesJSON(text: string): ParsedCase[] {
  const data = JSON.parse(text);
  if (!Array.isArray(data)) throw new Error('JSON must be an array of cases.');
  return data.map((d, i) => {
    if (typeof d?.input !== 'string' || !d.input.trim()) {
      throw new Error(`Case ${i + 1} is missing a non-empty "input".`);
    }
    return {
      input: d.input,
      expected: typeof d.expected === 'string' ? d.expected : undefined,
      metadata:
        d.metadata && typeof d.metadata === 'object' ? (d.metadata as Record<string, unknown>) : undefined,
    };
  });
}

/** Minimal CSV splitter supporting quoted fields + embedded commas/newlines. */
function splitCSV(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = '';
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += c;
      }
    } else if (c === '"') {
      inQuotes = true;
    } else if (c === ',') {
      row.push(field);
      field = '';
    } else if (c === '\n' || c === '\r') {
      if (c === '\r' && text[i + 1] === '\n') i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = '';
    } else {
      field += c;
    }
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}
