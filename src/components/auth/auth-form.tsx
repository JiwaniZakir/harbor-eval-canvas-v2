'use client';

import { useState, type FormEvent } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { z } from 'zod';
import { Loader2, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { createClient } from '@/lib/supabase/client';

type Mode = 'login' | 'signup';

const credentialsSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
  password: z.string().min(8, 'Password must be at least 8 characters.'),
});

const emailSchema = z.object({
  email: z.string().email('Enter a valid email address.'),
});

interface AuthFormProps {
  mode: Mode;
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get('redirectedFrom');
  const initialError = searchParams.get('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [error, setError] = useState<string | null>(initialError);
  const [notice, setNotice] = useState<string | null>(null);

  const next = redirectedFrom && redirectedFrom.startsWith('/') ? redirectedFrom : '/';

  async function handlePasswordSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setNotice(null);

    const parsed = credentialsSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input.');
      return;
    }

    setLoading(true);
    const supabase = createClient();

    try {
      if (mode === 'login') {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email: parsed.data.email,
          password: parsed.data.password,
        });
        if (signInError) throw signInError;
        router.replace(next);
        router.refresh();
      } else {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: parsed.data.email,
          password: parsed.data.password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
          },
        });
        if (signUpError) throw signUpError;

        // If email confirmation is disabled, a session is returned immediately.
        if (data.session) {
          router.replace(next);
          router.refresh();
        } else {
          setNotice(
            'Check your email to confirm your account, then sign in.',
          );
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    setError(null);
    setNotice(null);

    const parsed = emailSchema.safeParse({ email });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Enter a valid email.');
      return;
    }

    setMagicLoading(true);
    const supabase = createClient();

    try {
      const { error: otpError } = await supabase.auth.signInWithOtp({
        email: parsed.data.email,
        options: {
          shouldCreateUser: mode === 'signup',
          emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(next)}`,
        },
      });
      if (otpError) throw otpError;
      setNotice(`We sent a magic link to ${parsed.data.email}. Check your inbox.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not send magic link.');
    } finally {
      setMagicLoading(false);
    }
  }

  const busy = loading || magicLoading;

  return (
    <div className="auth-card">
      <div className="auth-header">
        <div className="auth-brand">Harbor Eval</div>
        <h1 className="auth-title">
          {mode === 'login' ? 'Welcome back' : 'Create your account'}
        </h1>
        <p className="auth-subtitle">
          {mode === 'login'
            ? 'Sign in to your evaluation workspace.'
            : 'Start building evaluations in minutes.'}
        </p>
      </div>

      <form className="auth-form" onSubmit={handlePasswordSubmit}>
        <label className="auth-field">
          <span className="auth-label">Email</span>
          <Input
            type="email"
            name="email"
            autoComplete="email"
            placeholder="you@company.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={busy}
            required
          />
        </label>

        <label className="auth-field">
          <span className="auth-label">Password</span>
          <Input
            type="password"
            name="password"
            autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={busy}
            required
          />
        </label>

        {error && <div className="auth-error" role="alert">{error}</div>}
        {notice && <div className="auth-notice" role="status">{notice}</div>}

        <Button type="submit" variant="primary" full disabled={busy}>
          {loading ? (
            <>
              <Loader2 size={16} className="auth-spin" />
              {mode === 'login' ? 'Signing in…' : 'Creating account…'}
            </>
          ) : mode === 'login' ? (
            'Sign in'
          ) : (
            'Create account'
          )}
        </Button>
      </form>

      <div className="auth-divider"><span>or</span></div>

      <Button
        type="button"
        variant="secondary"
        full
        disabled={busy}
        onClick={handleMagicLink}
      >
        {magicLoading ? (
          <>
            <Loader2 size={16} className="auth-spin" />
            Sending link…
          </>
        ) : (
          <>
            <Mail size={16} />
            Email me a magic link
          </>
        )}
      </Button>

      <p className="auth-switch">
        {mode === 'login' ? (
          <>
            Don&apos;t have an account?{' '}
            <Link href="/signup" className="auth-link">Sign up</Link>
          </>
        ) : (
          <>
            Already have an account?{' '}
            <Link href="/login" className="auth-link">Sign in</Link>
          </>
        )}
      </p>
    </div>
  );
}
