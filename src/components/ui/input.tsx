'use client';

import { type InputHTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

type InputSize = 'sm' | 'md' | 'lg';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  inputSize?: InputSize;
}

const sizeClass: Record<InputSize, string> = {
  sm: 'input-sm',
  md: 'input-md',
  lg: 'input-lg',
};

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ inputSize = 'md', className, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={cn('input', sizeClass[inputSize], className)}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';
