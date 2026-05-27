'use client';

import { X } from 'lucide-react';
import { useToastStore } from '@/lib/stores/toast-store';

export function ToastStack() {
  const toasts = useToastStore((s) => s.toasts);
  const removeToast = useToastStore((s) => s.removeToast);

  if (toasts.length === 0) return null;

  return (
    <div className="toast-stack">
      {toasts.map((toast) => (
        <div key={toast.id} className="toast">
          <span className="toast-dot" data-type={toast.type} />
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-dismiss"
            onClick={() => removeToast(toast.id)}
          >
            <X size={12} />
          </button>
          <div
            className="toast-countdown"
            style={{ animationDuration: `${toast.duration}ms` }}
          />
        </div>
      ))}
    </div>
  );
}
