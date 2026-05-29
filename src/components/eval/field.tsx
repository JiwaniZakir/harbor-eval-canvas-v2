'use client';

import { type ReactNode } from 'react';

/** A labeled form field wrapper for the eval forms. */
export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="eval-field">
      <span className="field-label">{label}</span>
      {children}
    </label>
  );
}
