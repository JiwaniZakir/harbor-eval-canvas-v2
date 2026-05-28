'use client';

import { useEffect, useCallback, useState } from 'react';
import { X, Check, Play, ArrowRight, RotateCcw, Clock, ChevronDown, ChevronRight, Tag } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { DOMAIN_META, PIPELINE_STAGES } from '@/lib/types';
import type { DomainStatus, PipelineStageState, DomainId } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Spinner } from '@/components/ui/spinner';
import { Button } from '@/components/ui/button';
import { runDomainProbe, runDomainScaffold, runDomainValidation } from '@/lib/eval-pipeline';
import { DOMAIN_TASKS, type DomainTask } from '@/lib/domain-tasks';

function getPipelineStageState(status: DomainStatus, stageIdx: number): PipelineStageState {
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

  const activeStages: Record<number, DomainStatus[]> = {
    0: ['probe_queued'],
    1: ['probing'],
    2: ['scaffold_queued', 'scaffolding'],
    3: ['validation_gate'],
    4: ['ready_to_publish'],
  };

  if (completeStages[stageIdx]?.includes(status)) return 'complete';
  if (activeStages[stageIdx]?.includes(status)) return 'active';

  // Check if any earlier stage is complete (which means this stage is available)
  for (let s = stageIdx - 1; s >= 0; s--) {
    if (completeStages[s]?.includes(status)) return 'available';
  }

  if (stageIdx === 0) return 'available';
  return 'locked';
}

function getStatusBadgeVariant(status: DomainStatus): 'default' | 'success' | 'warning' | 'error' | 'info' {
  if (['published', 'gate_passed', 'promoted'].includes(status)) return 'success';
  if (['rejected', 'gate_failed'].includes(status)) return 'error';
  if (['redesign', 'iterating', 'needs_review'].includes(status)) return 'warning';
  if (['probing', 'scaffolding', 'calibrating'].includes(status)) return 'info';
  return 'default';
}

const PROBE_VARIANTS = ['Plain', 'Prior Work', 'Schema Hint', 'Audit Trail', 'Speed Run'];
const SCAFFOLD_AGENTS = ['Fixtures', 'Environment', 'Verifier', 'Instruction', 'Contamination'];
const VALIDATION_GATES_META = [
  { name: 'Oracle Sweep', type: 'oracle' as const },
  { name: 'Nop Sweep', type: 'nop' as const },
  { name: 'Spoiler Lint', type: 'spoiler' as const },
];

export function WorkspacePlate() {
  const focusedDomainId = useUIStore((s) => s.focusedDomainId);
  const setFocusedDomain = useUIStore((s) => s.setFocusedDomain);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const domainStates = useDomainStore((s) => s.domainStates);
  const [isRunning, setIsRunning] = useState(false);

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

  const handleProbe = async () => {
    setIsRunning(true);
    setActiveTab('agent');
    try {
      await runDomainProbe(focusedDomainId as DomainId);
    } finally {
      setIsRunning(false);
    }
  };

  const handleScaffold = async () => {
    setIsRunning(true);
    setActiveTab('agent');
    try {
      await runDomainScaffold(focusedDomainId as DomainId);
    } finally {
      setIsRunning(false);
    }
  };

  const handleValidate = async () => {
    setIsRunning(true);
    setActiveTab('agent');
    try {
      await runDomainValidation(focusedDomainId as DomainId);
    } finally {
      setIsRunning(false);
    }
  };

  // Determine which fan-out and actions to show
  const canProbe = ['untested', 'probe_queued'].includes(domain.status) && !isRunning;
  const isProbing = domain.status === 'probing';
  const hasProbeResults = !!domain.probeSummary;
  const canScaffold = ['probe_complete', 'promoted'].includes(domain.status) && !isRunning;
  const isScaffolding = domain.status === 'scaffolding';
  const canValidate = domain.status === 'scaffold_complete' && !isRunning;
  const isValidating = domain.status === 'validation_gate';
  const isPublished = domain.status === 'published';

  return (
    <div className="workspace-plate" data-domain={focusedDomainId}>
      <div className="workspace-plate-card">
        {/* Domain Graphic Banner */}
        <div className="workspace-plate-banner">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={meta.graphic}
            alt={meta.label}
            className="workspace-plate-graphic"
          />
          <div className="workspace-plate-banner-overlay" />
        </div>

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

        {/* Description */}
        <p className="workspace-plate-description">{meta.description}</p>

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
                    <span className="roadmap-stage-icon" style={{ opacity: state === 'locked' ? 0.3 : 0.6, fontSize: 12 }}>
                      {i + 1}
                    </span>
                  )}
                  <span className="roadmap-stage-label">{stage.label}</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 8, margin: '16px 0' }}>
          {canProbe && (
            <Button variant="primary" size="md" onClick={handleProbe}>
              <Play size={14} /> Run Probe
            </Button>
          )}
          {isProbing && (
            <Button variant="secondary" size="md" disabled>
              <Spinner size="sm" /> Probing...
            </Button>
          )}
          {canScaffold && (
            <Button variant="primary" size="md" onClick={handleScaffold}>
              <ArrowRight size={14} /> Scaffold
            </Button>
          )}
          {isScaffolding && (
            <Button variant="secondary" size="md" disabled>
              <Spinner size="sm" /> Scaffolding...
            </Button>
          )}
          {canValidate && (
            <Button variant="primary" size="md" onClick={handleValidate}>
              <ArrowRight size={14} /> Validate
            </Button>
          )}
          {isValidating && (
            <Button variant="secondary" size="md" disabled>
              <Spinner size="sm" /> Validating...
            </Button>
          )}
          {isPublished && (
            <Badge variant="success">Published ✅</Badge>
          )}
          {domain.status === 'gate_failed' && (
            <Button variant="secondary" size="md" onClick={handleProbe}>
              <RotateCcw size={14} /> Retry
            </Button>
          )}
        </div>

        {/* Probe Results */}
        {hasProbeResults && (
          <div>
            <h3 style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 13, color: 'var(--fg-60)', marginBottom: 8 }}>
              Probe Results: {domain.probeSummary?.weaknessTitle}
            </h3>
            <div className="fanout-grid">
              {PROBE_VARIANTS.map((name, i) => {
                const variant = domain.probeSummary?.variants?.[i];
                const state = variant?.status || 'idle';
                const rate = variant?.failureRate;

                return (
                  <Card key={name} variant="default" className={`stagger-${i + 1}`}>
                    <div
                      className="fanout-card"
                      data-state={state}
                    >
                      <div className="fanout-card-header">
                        <span className="fanout-card-name">{name}</span>
                        {state === 'running' && <Spinner size="sm" />}
                        {state === 'complete' && <Check size={14} style={{ color: 'var(--status-success)' }} />}
                      </div>
                      {rate !== undefined && (
                        <span
                          className="fanout-card-rate tabular-nums"
                          style={{
                            color: rate < 0.3 ? 'var(--status-success)' :
                              rate < 0.5 ? 'var(--status-warning)' :
                              'var(--status-error)',
                          }}
                        >
                          {(rate * 100).toFixed(0)}%
                        </span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>

            {domain.probeSummary && (
              <div className="fanout-verdict">
                <span className="fanout-verdict-mean tabular-nums">
                  {domain.probeSummary.aggregateFailureRate !== undefined
                    ? `${(domain.probeSummary.aggregateFailureRate * 100).toFixed(1)}% mean failure`
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

        {/* Scaffold Agents */}
        {domain.scaffoldAgents && domain.scaffoldAgents.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 13, color: 'var(--fg-60)', marginBottom: 8 }}>
              Scaffold Artifacts
            </h3>
            <div className="fanout-grid">
              {SCAFFOLD_AGENTS.map((name, i) => {
                const agent = domain.scaffoldAgents?.[i];
                const state = agent?.status || 'idle';
                return (
                  <Card key={name} variant="default" className={`stagger-${i + 1}`}>
                    <div className="fanout-card" data-state={state}>
                      <div className="fanout-card-header">
                        <span className="fanout-card-name">{name}</span>
                        {state === 'running' && <Spinner size="sm" />}
                        {state === 'complete' && <Check size={14} style={{ color: 'var(--status-success)' }} />}
                      </div>
                      {agent?.artifactLabel && (
                        <span className="fanout-card-artifact">{agent.artifactLabel}</span>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Validation Gates */}
        {domain.validationGates && domain.validationGates.length > 0 && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 13, color: 'var(--fg-60)', marginBottom: 8 }}>
              Validation Gates
            </h3>
            <div className="fanout-grid">
              {VALIDATION_GATES_META.map((gate) => {
                const gateData = domain.validationGates?.find((g) => g.type === gate.type);
                const state = gateData?.status || 'pending';
                return (
                  <Card key={gate.name} variant="default">
                    <div className="fanout-card gate-card" data-state={state}>
                      <div className="fanout-card-header">
                        <span className="fanout-card-name">{gate.name}</span>
                        {state === 'running' && <Spinner size="sm" />}
                        {state === 'passed' && <Check size={14} style={{ color: 'var(--status-success)' }} />}
                        {state === 'failed' && <X size={14} style={{ color: 'var(--status-error)' }} />}
                      </div>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        )}

        {/* Sweep Results */}
        {domain.sweepSummary && (
          <div style={{ marginTop: 16 }}>
            <h3 style={{ fontFamily: 'var(--font-inter)', fontWeight: 600, fontSize: 13, color: 'var(--fg-60)', marginBottom: 8 }}>
              Sweep Results
            </h3>
            <div style={{ textAlign: 'center', marginBottom: 12 }}>
              <span
                className="sweep-headline tabular-nums"
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

        {/* Domain Tasks - Cofounder-style detailed task breakdown */}
        <DomainTaskList domainId={focusedDomainId as DomainId} />
      </div>
    </div>
  );
}

/* ================================================================
   Task List Component - Cofounder-style expandable task cards
   ================================================================ */

function DomainTaskList({ domainId }: { domainId: DomainId }) {
  const tasks = DOMAIN_TASKS[domainId] || [];
  const [expandedTask, setExpandedTask] = useState<string | null>(null);

  if (tasks.length === 0) return null;

  const totalSubtasks = tasks.reduce((sum, t) => sum + t.subtasks.length, 0);
  const doneSubtasks = tasks.reduce((sum, t) => sum + t.subtasks.filter(s => s.done).length, 0);
  const totalMinutes = tasks.reduce((sum, t) => sum + t.estimatedMinutes, 0);

  return (
    <div style={{ marginTop: 20 }}>
      <div className="task-list-header">
        <h3 className="text-heading-sm">Evaluation Tasks</h3>
        <span className="text-caption" style={{ color: 'var(--fg-35)' }}>
          {doneSubtasks}/{totalSubtasks} subtasks · ~{totalMinutes} min
        </span>
      </div>

      <div className="task-list">
        {tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            expanded={expandedTask === task.id}
            onToggle={() => setExpandedTask(expandedTask === task.id ? null : task.id)}
          />
        ))}
      </div>
    </div>
  );
}

function TaskCard({ task, expanded, onToggle }: { task: DomainTask; expanded: boolean; onToggle: () => void }) {
  const doneCount = task.subtasks.filter(s => s.done).length;
  const progress = task.subtasks.length > 0 ? (doneCount / task.subtasks.length) * 100 : 0;

  const priorityColor = {
    critical: 'var(--status-error)',
    high: 'var(--status-warning)',
    medium: 'var(--fg-40)',
    low: 'var(--fg-20)',
  }[task.priority];

  const stageLabel = {
    probe: 'Probe',
    scaffold: 'Scaffold',
    validate: 'Validate',
    publish: 'Publish',
  }[task.stage];

  return (
    <div className="task-card" data-priority={task.priority}>
      <div className="task-card-header" onClick={onToggle} style={{ cursor: 'pointer' }}>
        <div className="task-card-expand">
          {expanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </div>
        <div className="task-card-content">
          <div className="task-card-title-row">
            <span className="task-card-title">{task.title}</span>
            <span className="task-card-priority" style={{ color: priorityColor }}>
              {task.priority}
            </span>
          </div>
          <div className="task-card-meta">
            <span className="task-card-stage">
              <Tag size={10} /> {stageLabel}
            </span>
            <span className="task-card-time">
              <Clock size={10} /> {task.estimatedMinutes}m
            </span>
            <span className="task-card-progress">
              {doneCount}/{task.subtasks.length}
            </span>
          </div>
          {/* Progress bar */}
          <div className="task-card-progress-bar">
            <div className="task-card-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      {expanded && (
        <div className="task-card-body">
          <p className="task-card-description">{task.description}</p>
          <div className="task-card-subtasks">
            {task.subtasks.map((sub) => (
              <label key={sub.id} className="task-card-subtask">
                <input type="checkbox" defaultChecked={sub.done} className="task-card-checkbox" />
                <span className="task-card-subtask-label">{sub.label}</span>
              </label>
            ))}
          </div>
          {task.tags.length > 0 && (
            <div className="task-card-tags">
              {task.tags.map((tag) => (
                <span key={tag} className="task-card-tag">{tag}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
