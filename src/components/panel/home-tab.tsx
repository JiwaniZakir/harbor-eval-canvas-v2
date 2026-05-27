'use client';

import { ArrowRight, Play } from 'lucide-react';
import { useProjectStore } from '@/lib/stores/project-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useAgentStore } from '@/lib/stores/agent-store';
import { ALL_DOMAIN_IDS, DOMAIN_META } from '@/lib/types';
import type { DomainId } from '@/lib/types';
import { getTimeGreeting, formatRelativeTime } from '@/lib/utils';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export function HomeTab() {
  const project = useProjectStore((s) => s.project);
  const domainStates = useDomainStore((s) => s.domainStates);
  const setFocusedDomain = useUIStore((s) => s.setFocusedDomain);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const messages = useAgentStore((s) => s.messages);

  // Calculate progress
  const completedStatuses = ['published', 'gate_passed'] as const;
  const completedCount = ALL_DOMAIN_IDS.filter(
    (id) => completedStatuses.includes(domainStates[id].status as typeof completedStatuses[number])
  ).length;
  const progressPct = Math.round((completedCount / 8) * 100);

  // Domain overview
  const domainOverview = ALL_DOMAIN_IDS.map((id) => ({
    id,
    meta: DOMAIN_META[id],
    status: domainStates[id].status,
  }));

  // Suggested actions: untested or actionable domains
  const actionable = ALL_DOMAIN_IDS.filter((id) =>
    ['untested', 'probe_queued', 'promoted', 'scaffold_complete', 'gate_failed', 'redesign'].includes(
      domainStates[id].status
    )
  ).slice(0, 4);

  // Real activity from agent messages (last 5)
  const recentActivity = messages
    .filter((m) => m.role === 'assistant' || m.role === 'system')
    .slice(-5)
    .reverse();

  return (
    <div>
      <h1 className="home-greeting">{getTimeGreeting()}, Zakir</h1>
      <p className="home-project-name">{project?.name || 'No project'}</p>

      {/* Progress Ring */}
      <div className="home-progress-ring">
        <svg width="56" height="56" viewBox="0 0 56 56">
          <circle
            cx="28" cy="28" r="24"
            fill="none" stroke="var(--fg-5)" strokeWidth="3"
          />
          <circle
            cx="28" cy="28" r="24"
            fill="none" stroke="var(--fg-40)" strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={2 * Math.PI * 24}
            strokeDashoffset={2 * Math.PI * 24 * (1 - progressPct / 100)}
            transform="rotate(-90 28 28)"
            style={{ transition: 'stroke-dashoffset 600ms var(--ease-smooth)' }}
          />
          <text
            x="28" y="28"
            textAnchor="middle"
            dominantBaseline="central"
            className="tabular-nums"
            style={{
              fontFamily: 'var(--font-departure)',
              fontWeight: 600,
              fontSize: 14,
              fill: 'var(--fg-80)',
            }}
          >
            {progressPct}%
          </text>
        </svg>
        <div>
          <div className="home-progress-value tabular-nums">{completedCount}/8</div>
          <div className="home-progress-label">domains evaluated</div>
          <div className="home-progress-bar">
            <div className="home-progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Domain Status Grid */}
      {project && (
        <>
          <div className="home-section-label">Domain Status</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6, marginBottom: 16 }}>
            {domainOverview.map(({ id, meta, status }) => (
              <div
                key={id}
                data-domain={id}
                onClick={() => setFocusedDomain(id as DomainId)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 8px',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  transition: 'background 150ms',
                  fontSize: 12,
                  fontFamily: 'var(--font-figtree)',
                }}
                className="home-domain-item"
              >
                <span
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: '50%',
                    background: status === 'published' ? 'var(--status-success)' :
                      status === 'untested' ? 'var(--fg-15)' :
                      'var(--domain-accent)',
                    flexShrink: 0,
                  }}
                />
                <span style={{ color: 'var(--fg-60)', flex: 1 }}>{meta.shortLabel}</span>
                <span style={{ color: 'var(--fg-30)', fontSize: 10 }}>{status.replace(/_/g, ' ')}</span>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Suggested Actions */}
      {actionable.length > 0 && project && (
        <>
          <div className="home-section-label">Suggested Next</div>
          {actionable.map((id) => {
            const meta = DOMAIN_META[id];
            const status = domainStates[id].status;
            const actionText =
              status === 'untested' ? `Probe ${meta.shortLabel}` :
              status === 'probe_queued' ? `Start probing ${meta.shortLabel}` :
              status === 'promoted' ? `Scaffold ${meta.shortLabel}` :
              status === 'scaffold_complete' ? `Validate ${meta.shortLabel}` :
              status === 'gate_failed' ? `Retry ${meta.shortLabel}` :
              `Review ${meta.shortLabel}`;

            return (
              <Card
                key={id}
                variant="interactive"
                onClick={() => {
                  setFocusedDomain(id as DomainId);
                }}
                className="home-action-card"
              >
                <span
                  className="home-action-dot"
                  data-domain={id}
                  style={{ background: 'var(--domain-accent)' }}
                />
                <span className="home-action-text">{actionText}</span>
                <ArrowRight className="home-action-arrow" />
              </Card>
            );
          })}
        </>
      )}

      {/* Real Activity Feed */}
      <div className="home-section-label">Recent Activity</div>
      {recentActivity.length > 0 ? (
        recentActivity.map((msg) => (
          <div key={msg.id} className="home-activity-item">
            <div className="home-activity-time">
              {formatRelativeTime(new Date(msg.timestamp))}
            </div>
            <div className="home-activity-text" style={{ 
              overflow: 'hidden', 
              textOverflow: 'ellipsis', 
              whiteSpace: 'nowrap',
              maxWidth: 260,
            }}>
              {msg.content.replace(/\*\*/g, '').replace(/\n/g, ' ').slice(0, 80)}
            </div>
          </div>
        ))
      ) : (
        <div className="home-activity-item">
          <div className="home-activity-text" style={{ color: 'var(--fg-30)' }}>
            No activity yet. Create a project to get started.
          </div>
        </div>
      )}
    </div>
  );
}
