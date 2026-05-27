'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type SpinnerSize = 'sm' | 'md' | 'lg';

interface SpinnerProps {
  size?: SpinnerSize;
  className?: string;
}

const sizeClass: Record<SpinnerSize, string> = {
  sm: 'spinner-sm',
  md: 'spinner-md',
  lg: 'spinner-lg',
};

export function Spinner({ size = 'md', className }: SpinnerProps) {
  return <Loader2 className={cn('spinner', sizeClass[size], className)} />;
}
