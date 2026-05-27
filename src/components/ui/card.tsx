'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface CardProps {
  variant?: 'default' | 'elevated' | 'interactive';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
  style?: React.CSSProperties;
  children: ReactNode;
}

export function Card({
  variant = 'default',
  selected = false,
  onClick,
  className,
  style,
  children,
}: CardProps) {
  return (
    <div
      style={style}
      className={cn(
        'card',
        variant === 'elevated' && 'card-elevated',
        variant === 'interactive' && 'card-interactive',
        className
      )}
      data-selected={selected || undefined}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onClick();
        }
      } : undefined}
    >
      {children}
    </div>
  );
}
