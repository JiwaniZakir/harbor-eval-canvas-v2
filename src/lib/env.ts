/**
 * Environment validation (I6 / #124).
 *
 * Parses + validates env vars with zod. Designed to NOT crash build/CI/tests
 * when optional vars are absent: only `validateEnvOrThrow()` enforces, and it
 * is meant to be called from runtime server code in production.
 */
import { z } from 'zod';

const envSchema = z.object({
  GEMINI_API_KEY: z.string().min(1).optional(),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url().optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1).optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1).optional(),
  // Optional integrations (no-op if unset)
  RESEND_API_KEY: z.string().optional(),
  SENTRY_DSN: z.string().optional(),
  SECRET_ENCRYPTION_KEY: z.string().optional(),
  EVAL_FAKE_MODEL: z.string().optional(),
});

export type Env = z.infer<typeof envSchema>;

export const env: Env = envSchema.parse(process.env);

const REQUIRED_IN_PROD = [
  'GEMINI_API_KEY',
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
] as const;

/**
 * Throws with a clear message if required vars are missing. Call this from a
 * runtime server entrypoint in production; skipped in test/CI.
 */
export function validateEnvOrThrow(): void {
  if (process.env.NODE_ENV !== 'production') return;
  if (process.env.CI || process.env.VITEST) return;
  const missing = REQUIRED_IN_PROD.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}. ` +
        `See .env.example and docs/PRODUCTION_DEPLOY.md.`,
    );
  }
}
