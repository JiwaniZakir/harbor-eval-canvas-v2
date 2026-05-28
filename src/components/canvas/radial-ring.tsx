'use client';

import { useMemo } from 'react';
import { Compass } from 'lucide-react';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useProjectStore } from '@/lib/stores/project-store';
import { NodeStatusIcon } from './node-status-icon';
import { ALL_DOMAIN_IDS, DOMAIN_META } from '@/lib/types';
import type { DomainStatus } from '@/lib/types';

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

      {/* Domain Nodes - Cofounder-style pale summary shells */}
      {ALL_DOMAIN_IDS.map((domainId, i) => {
        const pos = getNodePosition(i);
        const state = domainStates[domainId];
        const meta = DOMAIN_META[domainId];
        const isFocused = focusedDomainId === domainId;
        const isDimmed = focusedDomainId !== null && !isFocused;

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
              <div className="domain-node-thumb">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={meta.graphic}
                  alt={meta.label}
                  className="domain-node-thumb-img"
                  loading="lazy"
                  decoding="async"
                  width={328}
                  height={195}
                />
                <span className="domain-node-thumb-overlay" />
              </div>
              <div className="domain-node-inner">
                <NodeStatusIcon status={state.status} />
                <span className="domain-node-label">{meta.shortLabel}</span>
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
