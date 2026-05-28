'use client';

import { useMemo } from 'react';
import { Compass, ChevronRight } from 'lucide-react';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useProjectStore } from '@/lib/stores/project-store';
import { ALL_DOMAIN_IDS, DOMAIN_META } from '@/lib/types';
import type { DomainId, DomainStatus } from '@/lib/types';

const RING_RADIUS = 225;
const RING_CENTER = 300;
const NODE_ANGLES = ALL_DOMAIN_IDS.map((_, i) => (i * 360) / 8 - 90);

function getNodePosition(index: number) {
  const angle = NODE_ANGLES[index];
  const rad = (angle * Math.PI) / 180;
  return {
    x: RING_CENTER + RING_RADIUS * Math.cos(rad),
    y: RING_CENTER + RING_RADIUS * Math.sin(rad),
  };
}

function getConnectionState(status: DomainStatus): string {
  const activeStates: DomainStatus[] = [
    'probing', 'probe_queued', 'scaffolding', 'scaffold_queued',
  ];
  const completedStates: DomainStatus[] = [
    'probe_complete', 'promoted', 'gate_passed', 'scaffold_complete',
    'published', 'sweep_complete',
  ];

  if (activeStates.includes(status)) return 'animated';
  if (completedStates.includes(status)) return 'active';
  return 'dashed';
}

function getStatusText(status: DomainStatus): string {
  switch (status) {
    case 'untested': return 'Ready';
    case 'probing': case 'probe_queued': return 'Probing...';
    case 'probe_complete': return 'Probed';
    case 'promoted': return 'Promoted';
    case 'scaffolding': case 'scaffold_queued': return 'Building...';
    case 'scaffold_complete': return 'Built';
    case 'validation_gate': return 'Validating';
    case 'gate_passed': return 'Passed';
    case 'published': return 'Published';
    case 'rejected': return 'Failed';
    case 'redesign': return 'Redesign';
    case 'iterating': return 'Iterating';
    case 'target_sweep': case 'sweep_complete': return 'Swept';
    default: return 'Ready';
  }
}

const CIRCUMFERENCE = 2 * Math.PI * 257;

export function RadialRing() {
  const domainStates = useDomainStore((s) => s.domainStates);
  const focusedDomainId = useUIStore((s) => s.focusedDomainId);
  const setFocusedDomain = useUIStore((s) => s.setFocusedDomain);
  const globalProgress = useProjectStore((s) => s.project?.globalProgress ?? 0);

  const progressOffset = useMemo(() => {
    return CIRCUMFERENCE * (1 - globalProgress / 100);
  }, [globalProgress]);

  return (
    <div className="radial-ring">
      {/* SVG Rings and Connection Lines */}
      <svg viewBox="0 0 600 600" width="600" height="600">
        {/* Base ring */}
        <circle
          cx={RING_CENTER}
          cy={RING_CENTER}
          r={257}
          className="ring-base"
        />

        {/* Progress ring */}
        <circle
          cx={RING_CENTER}
          cy={RING_CENTER}
          r={257}
          className="ring-progress"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={progressOffset}
          transform={`rotate(-90 ${RING_CENTER} ${RING_CENTER})`}
        />

        {/* Connection lines */}
        {ALL_DOMAIN_IDS.map((domainId, i) => {
          const state = domainStates[domainId];
          const connectionState = getConnectionState(state.status);
          const angle = (NODE_ANGLES[i] * Math.PI) / 180;
          const startX = RING_CENTER + 35 * Math.cos(angle);
          const startY = RING_CENTER + 35 * Math.sin(angle);
          const endX = RING_CENTER + (RING_RADIUS - 54) * Math.cos(angle);
          const endY = RING_CENTER + (RING_RADIUS - 54) * Math.sin(angle);

          return (
            <line
              key={domainId}
              x1={startX} y1={startY}
              x2={endX} y2={endY}
              className="connection-line"
              data-state={connectionState}
              data-domain={domainId}
            />
          );
        })}
      </svg>

      {/* Domain Nodes - Cofounder-style workspace plates */}
      {ALL_DOMAIN_IDS.map((domainId, i) => {
        const pos = getNodePosition(i);
        const state = domainStates[domainId];
        const meta = DOMAIN_META[domainId];
        const isFocused = focusedDomainId === domainId;
        const isDimmed = focusedDomainId !== null && !isFocused;
        const statusText = getStatusText(state.status);

        return (
          <div
            key={domainId}
            className="domain-node"
            data-domain={domainId}
            data-state={state.status}
            data-focused={isFocused || undefined}
            data-dimmed={isDimmed || undefined}
            style={{ left: pos.x, top: pos.y }}
            onClick={() => setFocusedDomain(isFocused ? null : domainId)}
          >
            <div className="domain-node-outer">
              {/* Notch bar (dark toolbar) */}
              <div className="domain-node-notch">
                <span className="domain-node-notch-dot" />
                <span className="domain-node-notch-label">{meta.shortLabel}</span>
                <ChevronRight className="domain-node-notch-caret" />
              </div>

              {/* Node body with status */}
              <div className="domain-node-body">
                <span className="domain-node-status">{statusText}</span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Center Hub */}
      <div
        className="center-hub"
        onClick={() => setFocusedDomain(null)}
      >
        <Compass className="center-hub-icon" />
        <span className="center-hub-label">Harbor Eval</span>
      </div>
    </div>
  );
}
