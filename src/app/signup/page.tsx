import { Suspense } from 'react';
import { AuthForm } from '@/components/auth/auth-form';

export const metadata = {
  title: 'Sign up · Harbor Eval',
};

export default function SignupPage() {
  return (
    <main className="auth-page">
      <Suspense fallback={<div className="auth-card auth-card--loading" />}>
        <AuthForm mode="signup" />
      </Suspense>
    </main>
  );
}
