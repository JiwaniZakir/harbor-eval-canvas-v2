'use client';

import { cn } from '@/lib/utils';

interface SkeletonProps {
  className?: string;
  style?: React.CSSProperties;
}

export function SkeletonLine({ className, style }: SkeletonProps) {
  return <div className={cn('skeleton skeleton-line', className)} style={style} />;
}

export function SkeletonTitle({ className, style }: SkeletonProps) {
  return <div className={cn('skeleton skeleton-title', className)} style={style} />;
}

export function SkeletonCircle({ className, size = 24, style }: SkeletonProps & { size?: number }) {
  return (
    <div
      className={cn('skeleton skeleton-circle', className)}
      style={{ width: size, height: size, ...style }}
    />
  );
}

export function SkeletonCard({ className, style }: SkeletonProps) {
  return <div className={cn('skeleton skeleton-card', className)} style={style} />;
}

export function SkeletonStat({ className, style }: SkeletonProps) {
  return <div className={cn('skeleton skeleton-stat', className)} style={style} />;
}

// Tab-specific skeletons

export function HomeTabSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SkeletonTitle />
      <SkeletonLine style={{ width: '40%' }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, padding: 16 }}>
        <SkeletonCircle size={56} />
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <SkeletonStat />
          <SkeletonLine />
        </div>
      </div>
      <SkeletonCard />
      <SkeletonCard />
    </div>
  );
}

export function AgentTabSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div style={{ display: 'flex', gap: 8 }}>
        <SkeletonCircle size={24} />
        <SkeletonCard style={{ width: '70%', height: 60 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
        <SkeletonCard style={{ width: '60%', height: 48 }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <SkeletonCircle size={24} />
        <SkeletonCard style={{ width: '80%', height: 72 }} />
      </div>
    </div>
  );
}

export function ProjectTabSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <SkeletonTitle style={{ width: '30%' }} />
      {[1, 2, 3, 4].map((i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0' }}>
          <SkeletonLine style={{ width: '35%' }} />
          <SkeletonLine style={{ width: '45%' }} />
        </div>
      ))}
    </div>
  );
}

export function FilesTabSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      {[0, 16, 16, 32, 32, 16].map((indent, i) => (
        <div key={i} style={{ display: 'flex', gap: 6, alignItems: 'center', paddingLeft: indent }}>
          <SkeletonCircle size={12} />
          <SkeletonLine style={{ width: `${60 - indent}%` }} />
        </div>
      ))}
    </div>
  );
}

export function SweepsTabSkeleton() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <SkeletonStat style={{ width: 80, height: 32 }} />
      <SkeletonLine style={{ width: '50%' }} />
      {[1, 2, 3].map((i) => (
        <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: '8px 0' }}>
          <SkeletonCircle size={20} />
          <SkeletonLine style={{ flex: 1 }} />
        </div>
      ))}
    </div>
  );
}
