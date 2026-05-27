'use client';

import { useEffect, useCallback } from 'react';
import { X, Check } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { DOMAIN_META, PIPELINE_STAGES } from '@/lib/types';
import type { DomainStatus, PipelineStageState } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';

function getPipelineStageState(status: DomainStatus, stageIdx: number): PipelineStageState {
  const stageMap: Record<number, DomainStatus[]> = {
    0: ['probe_queued', 'probing', 'probe_complete', 'promoted', 'redesign', 'rejected',
        'scaffold_queued', 'scaffolding', 'scaffold_complete', 'validation_gate',
        'gate_passed', 'gate_failed', 'target_sweep', 'sweep_complete', 'iterating',
        'published', 'ready_to_publish'],
    1: ['probing', 'probe_complete', 'promoted', 'redesign', 'rejected',
        'scaffold_queued', 'scaffolding', 'scaffold_complete', 'validation_gate',
        'gate_passed', 'gate_failed', 'target_sweep', 'sweep_complete', 'iterating',
        'published', 'ready_to_publish'],
    2: ['scaffolding', 'scaffold_complete', 'validation_gate', 'gate_passed', 'gate_failed',
        'target_sweep', 'sweep_complete', 'iterating', 'published', 'ready_to_publish'],
    3: ['validation_gate', 'gate_passed', 'gate_failed', 'target_sweep', 'sweep_complete',
        'iterating', 'published', 'ready_to_publish'],
    4: ['published', 'ready_to_publish'],
  };

  const activeStages: Record<number, DomainStatus[]> = {
    0: ['probe_queued'],
    1: ['probing'],
    2: ['scaffold_queued', 'scaffolding'],
    3: ['validation_gate'],
    4: ['ready_to_publish'],
  };

  const completeStages: Record<number, DomainStatus[]> = {
    0: ['probing', 'probe_complete', 'promoted', 'scaffold_queued', 'scaffolding',
        'scaffold_complete', 'validation_gate', 'gate_passed', 'target_sweep',
        'sweep_complete', 'published', 'ready_to_publish'],
    1: ['probe_complete', 'promoted', 'scaffold_queued', 'scaffolding',
        'scaffold_complete', 'validation_gate', 'gate_passed', 'target_sweep',
        'sweep_complete', 'published', 'ready_to_publish'],
    2: ['scaffold_complete', 'validation_gate', 'gate_passed', 'target_sweep',
        'sweep_complete', 'published', 'ready_to_publish'],
    3: ['gate_passed', 'target_sweep', 'sweep_complete', 'published', 'ready_to_publish'],
    4: ['published'],
  };

  if (completeStages[stageIdx]?.includes(status)) return 'complete';
  if (activeStages[stageIdx]?.includes(status)) return 'active';
  if (stageMap[stageIdx]?.includes(status)) return 'available';
  return 'locked';
}

function getStatusBadgeVariant(status: DomainStatus): 'default' | 'success' | 'warning' | 'error' | 'info' {
  if (['published', 'gate_passed', 'promoted'].includes(status)) return 'success';
  if (['rejected', 'gate_failed'].includes(status)) return 'error';
  if (['redesign', 'iterating', 'needs_review'].includes(status)) return 'warning';
  if (['probing', 'scaffolding', 'calibrating'].includes(status)) return 'info';
  return 'default';
}

// Probe variant names
const PROBE_VARIANTS = ['Plain', 'Prior Work', 'Schema Hint', 'Audit Trail', 'Speed Run'];
const SCAFFOLD_AGENTS = ['Fixtures', 'Environment', 'Verifier', 'Instruction', 'Contamination'];
const VALIDATION_GATES = [
  { name: 'Oracle Sweep', type: 'oracle' as const },
  { name: 'Nop Sweep', type: 'nop' as const },
  { name: 'Spoiler Lint', type: 'spoiler' as const },
];

export function WorkspacePlate() {
  const focusedDomainId = useUIStore((s) => s.focusedDomainId);
  const setFocusedDomain = useUIStore((s) => s.setFocusedDomain);
  const domainStates = useDomainStore((s) => s.domainStates);

  // ESC to close
  const handleEsc = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') setFocusedDomain(null);
    },
    [setFocusedDomain]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [handleEsc]);

  if (!focusedDomainId) return null;

  const domain = domainStates[focusedDomainId];
  const meta = DOMAIN_META[focusedDomainId];
  const statusLabel = domain.status.replace(/_/g, ' ');

  // Determine which fan-out to show
  const showProbes = ['untested', 'probe_queued', 'probing', 'probe_complete'].includes(domain.status);
  const showScaffold = ['scaffold_queued', 'scaffolding', 'scaffold_complete'].includes(domain.status);
  const showValidation = ['validation_gate', 'gate_passed', 'gate_failed'].includes(domain.status);
  const showSweep = ['target_sweep', 'sweep_complete'].includes(domain.status);

  return (
    <div className="workspace-plate" data-domain={focusedDomainId}>
      <div className="workspace-plate-card">
        {/* Header */}
        <div className="workspace-plate-header">
          <span className="workspace-plate-dot" />
          <h2 className="workspace-plate-title">{meta.label}</h2>
          <Badge variant={getStatusBadgeVariant(domain.status)}>{statusLabel}</Badge>
          <button
            className="workspace-plate-close"
            onClick={() => setFocusedDomain(null)}
          >
            <X size={16} />
          </button>
        </div>

        {/* Pipeline Roadmap Strip */}
        <div className="roadmap-strip">
          {PIPELINE_STAGES.map((stage, i) => {
            const state = getPipelineStageState(domain.status, i);
            return (
              <div key={stage.id} style={{ display: 'flex', alignItems: 'center' }}>
                {i > 0 && (
                  <div
                    className="roadmap-connector"
                    data-state={state === 'complete' ? 'complete' : undefined}
                  />
                )}
                <div className="roadmap-stage" data-state={state}>
                  {state === 'active' ? (
                    <Spinner size="sm" />
                  ) : state === 'complete' ? (
                    <Check className="roadmap-stage-icon" />
                  ) : (
                    <img
                      src={`/eval-icons/${stage.icon}.svg`}
                      alt=""
                      className="roadmap-stage-icon"
                      style={{ opacity: state === 'locked' ? 0.3 : 1 }}
                    />
                  )}
                  <span className="roadmap-stage-label">{stage.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Fan-out content */}
        {showProbes && (
          <div>
            <div className="fanout-grid">
              {PROBE_VARIANTS.map((name, i) => {
                const variant = domain.probeSummary?.variants?.[i];
                const state = variant?.status || 'idle';
                const rate = variant?.failureRate;

                return (
                  <Card
                    key={name}
                    className={`fanout-card ${state === 'running' ? 'fanout-card' : ''}`}
                    variant="default"
                  >
                    <div
                      className="fanout-card"
                      data-state={state}
                      style={{ animationDelay: `${i * 80}ms` }}
                    >
                      <div className="fanout-card-header">
                        <span className="fanout-card-name">{name}</span>
                        {state === 'running' && <Spinner size="sm" />}
                        {state === 'complete' && <Check size={14} style={{ color: 'var(--status-success)' }} />}
                      </div>
                      {rate !== undefined && (
                        <span className="fanout-card-rate">{rate}%</span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {domain.probeSummary && (
              <div className="fanout-verdict">
                <span className="fanout-verdict-mean">
                  {domain.probeSummary.aggregateFailureRate !== undefined
                    ? `${domain.probeSummary.aggregateFailureRate}% mean`
                    : '---'}
                </span>
                {domain.probeSummary.verdict && (
                  <Badge
                    variant={
                      domain.probeSummary.verdict === 'promote'
                        ? 'success'
                        : domain.probeSummary.verdict === 'redesign'
                        ? 'warning'
                        : 'error'
                    }
                  >
                    {domain.probeSummary.verdict}
                  </Badge>
                )}
              </div>
            )}
          </div>
        )}

        {showScaffold && (
          <div className="fanout-grid">
            {SCAFFOLD_AGENTS.map((name, i) => {
              const agent = domain.scaffoldAgents?.[i];
              const state = agent?.status || 'idle';
              return (
                <Card key={name} className="fanout-card" data-state={state}>
                  <div className="fanout-card-header">
                    <span className="fanout-card-name">{name}</span>
                    {state === 'running' && <Spinner size="sm" />}
                    {state === 'complete' && <Check size={14} style={{ color: 'var(--status-success)' }} />}
                  </div>
                  {agent?.artifactLabel && (
                    <span className="fanout-card-artifact">{agent.artifactLabel}</span>
                  )}
                </Card>
              );
            })}
          </div>
        )}

        {showValidation && (
          <div className="fanout-grid">
            {VALIDATION_GATES.map((gate) => {
              const gateData = domain.validationGates?.find((g) => g.type === gate.type);
              const state = gateData?.status || 'pending';
              return (
                <Card key={gate.name} className={`fanout-card gate-card`} data-state={state}>
                  <div className="fanout-card-header">
                    <span className="fanout-card-name">{gate.name}</span>
                    {state === 'running' && <Spinner size="sm" />}
                    {state === 'passed' && <Check size={14} style={{ color: 'var(--status-success)' }} />}
                    {state === 'failed' && <X size={14} style={{ color: 'var(--status-error)' }} />}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {showSweep && domain.sweepSummary && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 16 }}>
              <span
                className="sweep-headline"
                data-result={domain.sweepSummary.passAt3 >= 0.7 ? 'good' : domain.sweepSummary.passAt3 >= 0.4 ? 'partial' : 'bad'}
              >
                pass@3: {(domain.sweepSummary.passAt3 * 100).toFixed(0)}%
              </span>
            </div>
            {domain.sweepSummary.trials.map((trial) => (
              <div key={trial.idx} className="trial-row">
                <Badge variant={trial.status === 'pass' ? 'success' : 'error'}>
                  {trial.status}
                </Badge>
                <span className="trial-row-summary">{trial.summary}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
