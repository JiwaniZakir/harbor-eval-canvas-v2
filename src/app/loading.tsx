import { Spinner } from '@/components/ui/spinner';

export default function Loading() {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      background: 'var(--bg-l0)',
    }}>
      <Spinner size="lg" />
    </div>
  );
}
