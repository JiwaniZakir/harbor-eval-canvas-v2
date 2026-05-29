import { type Scorer, type ScoreResult, clamp01 } from './types';

/* json-schema: parse the response as JSON and validate it against a minimal
   JSON-Schema subset (type, required, properties, enum). Score is the fraction
   of checks satisfied so partially-valid responses are graded proportionally.

   We deliberately ship a tiny, dependency-free validator that covers the most
   common eval needs (object shape + required keys + primitive types + enums)
   rather than pulling in a full JSON-Schema engine. */

export interface JsonSchemaConfig {
  /** A JSON-Schema-like object. When omitted, `expected` is parsed as schema. */
  schema?: Record<string, unknown>;
  /** Require the response to be valid JSON even if no schema is given. */
  requireValidJson?: boolean;
}

interface Check {
  ok: boolean;
  detail: string;
}

function typeOf(value: unknown): string {
  if (value === null) return 'null';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}

function validate(value: unknown, schema: Record<string, unknown>, path: string, checks: Check[]): void {
  const expectedType = schema.type as string | undefined;
  if (expectedType) {
    const actual = typeOf(value);
    const match = expectedType === 'integer' ? actual === 'number' : actual === expectedType;
    checks.push({
      ok: match,
      detail: `${path || '$'}: expected type ${expectedType}, got ${actual}`,
    });
    if (!match) return;
  }

  if (Array.isArray(schema.enum)) {
    const ok = (schema.enum as unknown[]).some((e) => e === value);
    checks.push({ ok, detail: `${path || '$'}: value must be one of enum` });
  }

  if (expectedType === 'object' && value && typeof value === 'object') {
    const obj = value as Record<string, unknown>;
    const required = Array.isArray(schema.required) ? (schema.required as string[]) : [];
    for (const key of required) {
      checks.push({
        ok: Object.prototype.hasOwnProperty.call(obj, key),
        detail: `${path || '$'}.${key}: required`,
      });
    }
    const props = (schema.properties as Record<string, Record<string, unknown>> | undefined) ?? {};
    for (const [key, propSchema] of Object.entries(props)) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        validate(obj[key], propSchema, `${path}.${key}`, checks);
      }
    }
  }

  if (expectedType === 'array' && Array.isArray(value) && schema.items) {
    const itemSchema = schema.items as Record<string, unknown>;
    value.forEach((item, i) => validate(item, itemSchema, `${path}[${i}]`, checks));
  }
}

export function jsonSchemaScorer(config: JsonSchemaConfig = {}): Scorer {
  return {
    name: 'json_schema',
    label: 'JSON Schema',
    async score(_input, expected, response): Promise<ScoreResult> {
      let parsed: unknown;
      try {
        // Strip markdown code fences models love to add.
        const cleaned = response.trim().replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');
        parsed = JSON.parse(cleaned);
      } catch {
        return { score: 0, passed: false, rationale: 'Response is not valid JSON.' };
      }

      let schema = config.schema;
      if (!schema && expected) {
        try {
          schema = JSON.parse(expected) as Record<string, unknown>;
        } catch {
          schema = undefined;
        }
      }

      if (!schema) {
        // No schema: just require valid JSON.
        return { score: 1, passed: true, rationale: 'Response is valid JSON (no schema constraints).' };
      }

      const checks: Check[] = [];
      validate(parsed, schema, '', checks);
      if (checks.length === 0) {
        return { score: 1, passed: true, rationale: 'No constraints to evaluate; valid JSON.' };
      }
      const passedChecks = checks.filter((c) => c.ok).length;
      const fraction = clamp01(passedChecks / checks.length);
      const passed = passedChecks === checks.length;
      const failures = checks.filter((c) => !c.ok).map((c) => c.detail);
      return {
        score: fraction,
        passed,
        rationale: passed
          ? `All ${checks.length} schema constraint(s) satisfied.`
          : `${passedChecks}/${checks.length} constraints passed. Failed: ${failures.slice(0, 5).join('; ')}`,
      };
    },
  };
}
