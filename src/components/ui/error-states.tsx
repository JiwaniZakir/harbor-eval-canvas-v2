'use client';

import { type ReactNode } from 'react';
import { AlertTriangle, WifiOff, Ban, ServerCrash } from 'lucide-react';
import { Button } from './button';

type ErrorKind = 'network' | 'auth' | 'rate-limit' | 'server' | 'generic';

const errorConfig: Record<ErrorKind, { icon: ReactNode; title: string; description: string }> = {
  network: {
    icon: <WifiOff size={20} />,
    title: 'Connection Lost',
    description: 'Check your internet connection and try again.',
  },
  auth: {
    icon: <Ban size={20} />,
    title: 'Authentication Failed',
    description: 'Your session has expired. Please sign in again.',
  },
  'rate-limit': {
    icon: <AlertTriangle size={20} />,
    title: 'Rate Limited',
    description: 'Too many requests. Please wait a moment and try again.',
  },
  server: {
    icon: <ServerCrash size={20} />,
    title: 'Server Error',
    description: 'Something went wrong on our end. We are looking into it.',
  },
  generic: {
    icon: <AlertTriangle size={20} />,
    title: 'Something Went Wrong',
    description: 'An unexpected error occurred. Please try again.',
  },
};

interface ErrorStateProps {
  kind?: ErrorKind;
  title?: string;
  description?: string;
  onRetry?: () => void;
}

export function ErrorState({ kind = 'generic', title, description, onRetry }: ErrorStateProps) {
  const config = errorConfig[kind];
  return (
    <div className="error-state">
      <div className="error-state-icon">{config.icon}</div>
      <p className="error-state-title">{title || config.title}</p>
      <p className="error-state-description">{description || config.description}</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

interface ErrorBannerProps {
  message: string;
  onDismiss?: () => void;
}

export function ErrorBanner({ message, onDismiss }: ErrorBannerProps) {
  return (
    <div className="error-banner">
      <AlertTriangle size={14} />
      <span className="error-banner-message">{message}</span>
      {onDismiss && (
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      )}
    </div>
  );
}

interface ChatErrorProps {
  message: string;
  onRetry?: () => void;
}

export function ChatError({ message, onRetry }: ChatErrorProps) {
  return (
    <div className="chat-error">
      <AlertTriangle size={12} />
      <span>{message}</span>
      {onRetry && (
        <button className="chat-error-retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  );
}
