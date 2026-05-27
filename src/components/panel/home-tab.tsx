'use client';

import { ArrowRight } from 'lucide-react';
import { useProjectStore } from '@/lib/stores/project-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { ALL_DOMAIN_IDS, DOMAIN_META } from '@/lib/types';
import { getTimeGreeting, formatRelativeTime } from '@/lib/utils';
import { Card } from '@/components/ui/card';

export function HomeTab() {
  const project = useProjectStore((s) => s.project);
  const domainStates = useDomainStore((s) => s.domainStates);
  const setFocusedDomain = useUIStore((s) => s.setFocusedDomain);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  // Calculate progress
  const publishedCount = ALL_DOMAIN_IDS.filter(
    (id) => domainStates[id].status === 'published'
  ).length;
  const progressPct = Math.round((publishedCount / 8) * 100);

  // Suggested actions: domains with actionable status
  const actionable = ALL_DOMAIN_IDS.filter((id) =>
    ['probe_queued', 'scaffold_queued', 'validation_gate', 'ready_to_publish', 'redesign'].includes(
      domainStates[id].status
    )
  ).slice(0, 3);

  // Mock activity
  const activities = [
    { id: '1', text: 'Evaluation project created', timestamp: Date.now() - 120000 },
    { id: '2', text: 'Instruction Following probe started', timestamp: Date.now() - 300000 },
    { id: '3', text: 'Model configuration updated', timestamp: Date.now() - 600000 },
  ];

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
          <div className="home-progress-value">{publishedCount}/8</div>
          <div className="home-progress-label">domains evaluated</div>
          <div className="home-progress-bar">
            <div className="home-progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
      </div>

      {/* Suggested Actions */}
      {actionable.length > 0 && (
        <>
          <div className="home-section-label">Suggested Next</div>
          {actionable.map((id) => {
            const meta = DOMAIN_META[id];
            const status = domainStates[id].status;
            const actionText =
              status === 'probe_queued' ? `Start probing ${meta.shortLabel}` :
              status === 'scaffold_queued' ? `Scaffold ${meta.shortLabel}` :
              status === 'validation_gate' ? `Validate ${meta.shortLabel}` :
              status === 'ready_to_publish' ? `Publish ${meta.shortLabel}` :
              `Review ${meta.shortLabel}`;

            return (
              <Card
                key={id}
                variant="interactive"
                onClick={() => {
                  setFocusedDomain(id);
                  setActiveTab('agent');
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

      {/* Activity Feed */}
      <div className="home-section-label">Recent Activity</div>
      {activities.map((a) => (
        <div key={a.id} className="home-activity-item">
          <div className="home-activity-time">
            {formatRelativeTime(new Date(a.timestamp))}
          </div>
          <div className="home-activity-text">{a.text}</div>
        </div>
      ))}
    </div>
  );
}
