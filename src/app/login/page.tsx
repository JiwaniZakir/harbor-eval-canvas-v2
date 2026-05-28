import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata = {
  title: 'Sign in · Harbor Eval',
};

export default function LoginPage() {
  return (
    <main className="auth-page">
      <Suspense fallback={<div className="auth-card auth-card--loading" />}>
        <AuthForm mode="login" />
      </Suspense>
    </main>
  );
}
