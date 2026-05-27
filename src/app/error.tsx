'use client';

import { ErrorState } from '@/components/ui/error-states';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-l0)',
    }}>
      <ErrorState
        kind="generic"
        title="Application Error"
        description={error.message}
        onRetry={reset}
      />
    </div>
  );
}
