'use client';

import { Compass } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useUIStore } from '@/lib/stores/ui-store';
import { DOMAIN_META } from '@/lib/types';
import type { DomainId } from '@/lib/types';

// Six representative domains, each with a distinct pixel-art graphic.
const PREVIEW_DOMAINS: DomainId[] = [
  'reasoning_logic',
  'knowledge_factuality',
  'safety_alignment',
  'instruction_following',
  'multilinguality',
  'calibration_uncertainty',
];

export function EmptyCanvas() {
  const setSetupWizardOpen = useUIStore((s) => s.setSetupWizardOpen);
  const setGlobalState = useUIStore((s) => s.setGlobalState);

  return (
    <div className="empty-canvas">
      {/* Domain preview montage — pixel-art graphics visible on first load */}
      <div className="empty-canvas-montage" aria-hidden="true">
        {PREVIEW_DOMAINS.map((id, i) => {
          const meta = DOMAIN_META[id];
          return (
            <div
              key={id}
              className="empty-canvas-tile"
              style={{ animationDelay: `${i * 60}ms` }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={meta.graphic}
                alt=""
                loading="lazy"
                decoding="async"
                className="empty-canvas-tile-img"
              />
              <span className="empty-canvas-tile-label">{meta.shortLabel}</span>
            </div>
          );
        })}
      </div>

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
