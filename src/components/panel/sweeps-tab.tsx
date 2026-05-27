'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { ALL_DOMAIN_IDS, DOMAIN_META } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';

export function SweepsTab() {
  const domainStates = useDomainStore((s) => s.domainStates);
  const focusedDomainId = useUIStore((s) => s.focusedDomainId);
  const [expandedTrials, setExpandedTrials] = useState<Set<number>>(new Set());

  // Find domain with sweep data (prefer focused, fallback to any)
  const sweepDomain = focusedDomainId && domainStates[focusedDomainId].sweepSummary
    ? focusedDomainId
    : ALL_DOMAIN_IDS.find((id) => domainStates[id].sweepSummary) || null;

  const sweep = sweepDomain ? domainStates[sweepDomain].sweepSummary : null;

  const toggleTrial = (idx: number) => {
    setExpandedTrials((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  if (!sweep) {
    return (
      <div style={{ textAlign: 'center', padding: '40px 0' }}>
        <p style={{ fontFamily: 'var(--font-figtree)', fontSize: 14, color: 'var(--fg-40)' }}>
          No sweep results yet
        </p>
        <p style={{ fontFamily: 'var(--font-figtree)', fontSize: 12, color: 'var(--fg-30)', marginTop: 4 }}>
          Complete validation to see sweep data
        </p>
      </div>
    );
  }

  const passAt3Pct = (sweep.passAt3 * 100).toFixed(0);
  const result = sweep.passAt3 >= 0.7 ? 'good' : sweep.passAt3 >= 0.4 ? 'partial' : 'bad';

  return (
    <div>
      <Card variant="elevated" className="" style={{ marginBottom: 16, textAlign: 'center', padding: 20 }}>
        <div className="sweep-headline" data-result={result}>
          pass@3: {passAt3Pct}%
        </div>
        <div className="sweep-meta">
          {sweep.taskSlug} - {sweepDomain && DOMAIN_META[sweepDomain].label}
        </div>
      </Card>

      {/* Trial rows */}
      {sweep.trials.map((trial) => (
        <div key={trial.idx}>
          <div className="trial-row" onClick={() => toggleTrial(trial.idx)}>
            <Badge variant={trial.status === 'pass' ? 'success' : 'error'}>
              {trial.status}
            </Badge>
            <span className="trial-row-summary">{trial.summary}</span>
            {expandedTrials.has(trial.idx) ? (
              <ChevronDown size={14} style={{ color: 'var(--fg-30)' }} />
            ) : (
              <ChevronRight size={14} style={{ color: 'var(--fg-30)' }} />
            )}
          </div>

          {expandedTrials.has(trial.idx) && (
            <div className="trajectory-timeline" style={{ paddingLeft: 16 }}>
              <div className="trajectory-step">
                <span className="trajectory-dot" data-status={trial.status === 'pass' ? 'pass' : 'fail'} />
                <span className="trajectory-text">
                  Trial {trial.idx + 1}: reward={trial.reward.toFixed(2)} - {trial.summary}
                </span>
              </div>
            </div>
          )}
        </div>
      ))}

      {/* Comparison bars */}
      <div style={{ marginTop: 20 }}>
        <div className="home-section-label">Domain Comparison</div>
        {ALL_DOMAIN_IDS
          .filter((id) => domainStates[id].sweepSummary)
          .map((id) => {
            const s = domainStates[id].sweepSummary!;
            return (
              <div key={id} className="comparison-row" data-domain={id}>
                <span className="comparison-label">{DOMAIN_META[id].shortLabel}</span>
                <div className="comparison-bar-track">
                  <div
                    className="comparison-bar-fill"
                    style={{ width: `${s.passAt3 * 100}%` }}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
