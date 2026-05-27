'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'accent' | 'success' | 'warning' | 'error' | 'info';

interface BadgeProps {
  variant?: BadgeVariant;
  interactive?: boolean;
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  children: ReactNode;
}

const variantClass: Record<BadgeVariant, string> = {
  default: 'badge-default',
  accent: 'badge-accent',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
  info: 'badge-info',
};

export function Badge({
  variant = 'default',
  interactive = false,
  selected = false,
  onClick,
  className,
  children,
}: BadgeProps) {
  const Tag = interactive ? 'button' : 'span';
  return (
    <Tag
      className={cn(
        'badge',
        variantClass[variant],
        interactive && 'badge-interactive',
        className
      )}
      data-selected={selected || undefined}
      onClick={onClick}
      type={interactive ? 'button' : undefined}
    >
      {children}
    </Tag>
  );
}
