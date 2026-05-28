import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

/**
 * Handles the magic-link / OAuth code exchange. Supabase redirects here with a
 * `?code=...` (PKCE) param after the user clicks the email link.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl;
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/';

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (!error) {
      // `next` is validated to be a relative path to avoid open redirects.
      const safeNext = next.startsWith('/') ? next : '/';
      return NextResponse.redirect(`${origin}${safeNext}`);
    }
  }

  return NextResponse.redirect(
    `${origin}/login?error=Could not sign you in. Please try again.`,
  );
}
