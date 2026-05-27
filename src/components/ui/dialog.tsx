'use client';

import { type ReactNode, useEffect, useCallback } from 'react';

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  className?: string;
  children: ReactNode;
}

export function Dialog({ open, onClose, title, description, className, children }: DialogProps) {
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    },
    [onClose]
  );

  useEffect(() => {
    if (open) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open, handleEsc]);

  if (!open) return null;

  return (
    <>
      <div className="dialog-overlay" onClick={onClose} />
      <div className={`dialog-content ${className || ''}`} role="dialog" aria-modal="true">
        {title && <h2 className="dialog-title">{title}</h2>}
        {description && <p className="dialog-description">{description}</p>}
        {children}
      </div>
    </>
  );
}
