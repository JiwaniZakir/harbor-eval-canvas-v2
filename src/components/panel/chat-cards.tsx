'use client';

import { useState } from 'react';
import { ChevronDown, ChevronRight, Check, AlertTriangle, X } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import type { ToolCall, ProbeSummary } from '@/lib/types';

// --- Tool Call Card ---

interface ToolCallCardProps {
  toolCall: ToolCall;
}

export function ToolCallCard({ toolCall }: ToolCallCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="chat-card tool-call-card" onClick={() => setExpanded(!expanded)}>
      <div className="tool-call-header">
        {toolCall.status === 'running' || toolCall.status === 'queued' ? (
          <Spinner size="sm" />
        ) : toolCall.status === 'succeeded' ? (
          <Check size={12} style={{ color: 'var(--status-success)' }} />
        ) : (
          <AlertTriangle size={12} style={{ color: 'var(--status-error)' }} />
        )}
        <span style={{ flex: 1 }}>{toolCall.summary || toolCall.name}</span>
        {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
      </div>
      {expanded && (
        <div className="tool-call-body">
          <pre>{JSON.stringify(toolCall.args, null, 2)}</pre>
          {toolCall.result && (
            <>
              <div style={{ borderTop: '1px solid var(--fg-5)', margin: '8px 0' }} />
              <pre>{toolCall.result}</pre>
            </>
          )}
        </div>
      )}
    </div>
  );
}

// --- Probe Summary Card ---

interface ProbeSummaryCardProps {
  summary: ProbeSummary;
  onPromote?: () => void;
  onRedesign?: () => void;
}

export function ProbeSummaryCard({ summary, onPromote, onRedesign }: ProbeSummaryCardProps) {
  return (
    <div className="chat-card probe-summary-card">
      <div style={{ fontFamily: 'var(--font-figtree)', fontWeight: 500, fontSize: 13, color: 'var(--fg-70)', marginBottom: 10 }}>
        {summary.weaknessTitle}
      </div>

      {summary.variants.map((v) => {
        const level = v.failureRate >= 70 ? 'high' : v.failureRate >= 40 ? 'medium' : 'low';
        return (
          <div key={v.name} className="probe-variant-bar">
            <span className="probe-variant-label">{v.name}</span>
            <div className="probe-variant-track">
              <div
                className="probe-variant-fill"
                data-level={level}
                style={{ width: `${v.failureRate}%` }}
              />
            </div>
          </div>
        );
      })}

      <div className="probe-verdict-row">
        <span style={{ fontFamily: 'var(--font-departure)', fontSize: 14, fontWeight: 600, color: 'var(--fg-80)' }}>
          {summary.aggregateFailureRate !== undefined ? `${summary.aggregateFailureRate}%` : '---'}
        </span>
        <div style={{ display: 'flex', gap: 6 }}>
          {summary.verdict && (
            <Badge
              variant={
                summary.verdict === 'promote' ? 'success' :
                summary.verdict === 'redesign' ? 'warning' : 'error'
              }
            >
              {summary.verdict}
            </Badge>
          )}
          {onPromote && (
            <Button variant="primary" size="sm" onClick={onPromote}>
              Promote
            </Button>
          )}
          {onRedesign && (
            <Button variant="secondary" size="sm" onClick={onRedesign}>
              Redesign
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

// --- Approval Gate Card ---

interface ApprovalGateCardProps {
  title: string;
  description: string;
  onApprove?: () => void;
  onReject?: () => void;
}

export function ApprovalGateCard({ title, description, onApprove, onReject }: ApprovalGateCardProps) {
  return (
    <div className="chat-card approval-card">
      <div className="approval-card-header">
        <AlertTriangle size={16} className="approval-card-icon" />
        {title}
      </div>
      <p className="approval-card-body">{description}</p>
      <div className="approval-card-actions">
        <Button variant="primary" size="sm" onClick={onApprove}>
          Approve
        </Button>
        <Button variant="secondary" size="sm" onClick={onReject}>
          Reject
        </Button>
      </div>
    </div>
  );
}

// --- Iteration Card ---

interface DiffLine {
  type: 'removed' | 'added' | 'context';
  text: string;
}

interface IterationCardProps {
  title: string;
  diff: DiffLine[];
  onApply?: () => void;
  onDismiss?: () => void;
}

export function IterationCard({ title, diff, onApply, onDismiss }: IterationCardProps) {
  return (
    <div className="chat-card iteration-card">
      <div style={{ fontFamily: 'var(--font-figtree)', fontWeight: 500, fontSize: 13, color: 'var(--fg-70)', marginBottom: 8 }}>
        {title}
      </div>
      <div className="diff-view">
        {diff.map((line, i) => (
          <div key={i}>
            {line.type === 'removed' ? (
              <span className="diff-removed">- {line.text}</span>
            ) : line.type === 'added' ? (
              <span className="diff-added">+ {line.text}</span>
            ) : (
              <span style={{ color: 'var(--fg-50)' }}>  {line.text}</span>
            )}
          </div>
        ))}
      </div>
      <div className="iteration-actions">
        <Button variant="primary" size="sm" onClick={onApply}>
          Apply
        </Button>
        <Button variant="ghost" size="sm" onClick={onDismiss}>
          Dismiss
        </Button>
      </div>
    </div>
  );
}

// --- Sweep Result Card ---

interface SweepResultCardProps {
  passAtK: number;
  taskSlug: string;
  trials: { idx: number; status: 'pass' | 'fail'; summary: string }[];
}

export function SweepResultCard({ passAtK, taskSlug, trials }: SweepResultCardProps) {
  const pct = (passAtK * 100).toFixed(0);
  const result = passAtK >= 0.7 ? 'good' : passAtK >= 0.4 ? 'partial' : 'bad';

  return (
    <div className="chat-card sweep-result-card">
      <div className="sweep-result-headline" data-result={result}>
        pass@3: {pct}%
      </div>
      <div style={{ fontFamily: 'var(--font-figtree)', fontSize: 12, color: 'var(--fg-40)', marginBottom: 8 }}>
        {taskSlug}
      </div>
      {trials.map((t) => (
        <div key={t.idx} className="trial-row">
          <Badge variant={t.status === 'pass' ? 'success' : 'error'}>{t.status}</Badge>
          <span className="trial-row-summary">{t.summary}</span>
        </div>
      ))}
    </div>
  );
}
