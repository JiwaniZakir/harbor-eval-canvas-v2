import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

/**
 * Supabase client for use in Server Components, Route Handlers, and Server
 * Actions. Reads/writes the auth session via Next.js cookies.
 *
 * Note: the `setAll` handler can throw when called from a Server Component
 * (cookies are read-only there); that is expected and safe to ignore because
 * the middleware is responsible for refreshing the session cookie.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component. Safe to ignore when middleware
            // is refreshing user sessions.
          }
        },
      },
    },
  );
}

/**
 * Service-role client for trusted server-side operations that must bypass RLS
 * (e.g. admin tasks, seeding). NEVER import this into client components.
 */
export function createServiceRoleClient() {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return [];
        },
        setAll() {
          /* no-op: service-role client is stateless */
        },
      },
    },
  );
}
