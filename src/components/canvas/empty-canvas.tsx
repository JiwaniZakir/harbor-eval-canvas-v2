'use client';

import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/stores/ui-store';

export function EmptyCanvas() {
  const setSetupWizardOpen = useUIStore((s) => s.setSetupWizardOpen);
  const setGlobalState = useUIStore((s) => s.setGlobalState);

  return (
    <div className="empty-canvas">
      <Compass className="empty-canvas-icon" />
      <h2 className="empty-canvas-title">Harbor Eval Canvas</h2>
      <p className="empty-canvas-text">
        Create visual AI evaluations that probe model weaknesses with precision.
      </p>
      <Button
        variant="primary"
        size="lg"
        onClick={() => {
          setGlobalState('onboarding');
          setSetupWizardOpen(true);
        }}
      >
        Get Started
      </Button>
    </div>
  );
}
