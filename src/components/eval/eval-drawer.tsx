'use client';

import { X } from 'lucide-react';
import { useEvalUIStore, type EvalTab } from '@/lib/stores/eval-ui-store';
import { useProjectStore } from '@/lib/stores/project-store';
import { DatasetsPanel } from './datasets-panel';
import { RubricBuilder } from './rubric-builder';
import { RunsList } from './runs-list';
import { RunDetail } from './run-detail';

const TABS: { id: EvalTab; label: string }[] = [
  { id: 'datasets', label: 'Datasets' },
  { id: 'rubrics', label: 'Rubrics' },
  { id: 'runs', label: 'Runs' },
];

export function EvalDrawer() {
  const open = useEvalUIStore((s) => s.open);
  const tab = useEvalUIStore((s) => s.tab);
  const activeRunId = useEvalUIStore((s) => s.activeRunId);
  const setOpen = useEvalUIStore((s) => s.setOpen);
  const setTab = useEvalUIStore((s) => s.setTab);
  const project = useProjectStore((s) => s.project);

  if (!open) return null;

  const projectId = project?.id;

  return (
    <div className="eval-drawer-overlay" role="dialog" aria-label="Evaluations" aria-modal="true">
      <div className="eval-drawer-backdrop" onClick={() => setOpen(false)} />
      <aside className="eval-drawer">
        <header className="eval-drawer-head">
          <h2 className="eval-drawer-title">Evaluations</h2>
          <button className="eval-icon-btn" aria-label="Close" onClick={() => setOpen(false)}>
            <X size={18} />
          </button>
        </header>

        {!projectId ? (
          <div className="eval-empty">
            <p>Create or open a project first to run evaluations.</p>
          </div>
        ) : (
          <>
            <nav className="eval-tabs" role="tablist">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={tab === t.id}
                  className={tab === t.id ? 'eval-tab active' : 'eval-tab'}
                  onClick={() => setTab(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </nav>

            <div className="eval-drawer-body">
              {tab === 'datasets' && <DatasetsPanel projectId={projectId} />}
              {tab === 'rubrics' && <RubricBuilder projectId={projectId} />}
              {tab === 'runs' &&
                (activeRunId ? (
                  <RunDetail projectId={projectId} runId={activeRunId} />
                ) : (
                  <RunsList projectId={projectId} />
                ))}
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
