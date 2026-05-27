'use client';

import { type TextareaHTMLAttributes, forwardRef, useEffect, useRef, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  autoResize?: boolean;
  maxHeight?: number;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ autoResize = true, maxHeight = 140, className, onInput, ...props }, ref) => {
    const internalRef = useRef<HTMLTextAreaElement | null>(null);

    const setRef = useCallback(
      (el: HTMLTextAreaElement | null) => {
        internalRef.current = el;
        if (typeof ref === 'function') ref(el);
        else if (ref) ref.current = el;
      },
      [ref]
    );

    const handleAutoResize = useCallback(() => {
      const el = internalRef.current;
      if (!el || !autoResize) return;
      el.style.height = 'auto';
      el.style.height = `${Math.min(el.scrollHeight, maxHeight)}px`;
    }, [autoResize, maxHeight]);

    useEffect(() => {
      handleAutoResize();
    }, [handleAutoResize]);

    return (
      <textarea
        ref={setRef}
        className={cn('textarea', className)}
        onInput={(e) => {
          handleAutoResize();
          onInput?.(e);
        }}
        {...props}
      />
    );
  }
);

Textarea.displayName = 'Textarea';
