/**
 * API route helpers (I5 / #123): zod validation + in-memory rate limiting +
 * structured request logging. Designed to wrap existing route handlers.
 */
import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { log } from '@/lib/log';

// ---- Rate limiting (in-memory token bucket; per process) ----
interface Bucket {
  tokens: number;
  updatedAt: number;
}
const buckets = new Map<string, Bucket>();

export interface RateLimitOptions {
  /** Max requests per window. */
  limit?: number;
  /** Window in ms. */
  windowMs?: number;
}

function clientKey(req: NextRequest): string {
  const fwd = req.headers.get('x-forwarded-for');
  const ip = fwd?.split(',')[0]?.trim() || 'unknown';
  return `${ip}:${new URL(req.url).pathname}`;
}

export function rateLimit(req: NextRequest, opts: RateLimitOptions = {}): boolean {
  const limit = opts.limit ?? 30;
  const windowMs = opts.windowMs ?? 60_000;
  const key = clientKey(req);
  const now = Date.now();
  const b = buckets.get(key) ?? { tokens: limit, updatedAt: now };
  // Refill proportional to elapsed time.
  const refill = ((now - b.updatedAt) / windowMs) * limit;
  b.tokens = Math.min(limit, b.tokens + refill);
  b.updatedAt = now;
  if (b.tokens < 1) {
    buckets.set(key, b);
    return false;
  }
  b.tokens -= 1;
  buckets.set(key, b);
  return true;
}

export type Handler<T> = (
  req: NextRequest,
  body: T,
) => Promise<NextResponse> | NextResponse;

/**
 * Wrap a POST handler with rate limiting, zod body validation, logging.
 */
export function withValidation<T>(
  schema: z.ZodType<T>,
  handler: Handler<T>,
  opts: RateLimitOptions = {},
) {
  return async (req: NextRequest): Promise<NextResponse> => {
    const start = Date.now();
    const path = new URL(req.url).pathname;

    if (!rateLimit(req, opts)) {
      log.warn('rate_limited', { path });
      return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    let json: unknown;
    try {
      json = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const parsed = schema.safeParse(json);
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Validation failed', details: parsed.error.flatten() },
        { status: 400 },
      );
    }

    try {
      const res = await handler(req, parsed.data);
      log.info('request', { path, status: res.status, durationMs: Date.now() - start });
      return res;
    } catch (e) {
      log.error('request_error', { path, error: (e as Error).message });
      return NextResponse.json({ error: 'Internal error' }, { status: 500 });
    }
  };
}
