'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Play, Loader2, Star, StopCircle, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToastStore } from '@/lib/stores/toast-store';
import { useEvalUIStore } from '@/lib/stores/eval-ui-store';
import { listDatasets, type DatasetRow } from '@/lib/actions/datasets';
import { listRubrics, type RubricRow } from '@/lib/actions/rubrics';
import {
  listRuns,
  startRun,
  setBaseline,
  cancelRun,
  regressionVsBaseline,
  type RunRow,
} from '@/lib/actions/runs';

const STATUS_VARIANT: Record<RunRow['status'], string> = {
  queued: 'run-badge-queued',
  running: 'run-badge-running',
  completed: 'run-badge-completed',
  failed: 'run-badge-failed',
  canceled: 'run-badge-canceled',
};

export function RunsList({ projectId }: { projectId: string }) {
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [launching, setLaunching] = useState(false);
  const setActiveRunId = useEvalUIStore((s) => s.setActiveRunId);
  const addToast = useToastStore((s) => s.addToast);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const refresh = useCallback(async () => {
    const res = await listRuns(projectId);
    if (res.ok) setRuns(res.data);
    else setError(res.error);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  // Poll while any run is active.
  useEffect(() => {
    const hasActive = runs.some((r) => r.status === 'running' || r.status === 'queued');
    if (hasActive && !pollRef.current) {
      pollRef.current = setInterval(refresh, 2000);
    } else if (!hasActive && pollRef.current) {
      clearInterval(pollRef.current);
      pollRef.current = null;
    }
    return () => {
      if (pollRef.current) {
        clearInterval(pollRef.current);
        pollRef.current = null;
      }
    };
  }, [runs, refresh]);

  async function toggleBaseline(run: RunRow) {
    const next = !run.is_baseline;
    setRuns((prev) => prev.map((r) => (r.id === run.id ? { ...r, is_baseline: next } : r)));
    const res = await setBaseline(run.id, next);
    if (!res.ok) {
      addToast(`Failed to set baseline — ${res.error}`, 'error');
      refresh();
    }
  }

  async function diff(run: RunRow) {
    const res = await regressionVsBaseline(run.id);
    if (res.ok) {
      addToast({
        title: 'Regression vs baseline',
        description: `${res.data.regressions} regressions, ${res.data.improvements} improvements, Δavg ${res.data.deltaAvg.toFixed(3)}`,
        variant: res.data.regressions > 0 ? 'error' : 'success',
      });
    } else {
      addToast(`Diff failed — ${res.error}`, 'error');
    }
  }

  if (loading) {
    return (
      <div className="eval-loading">
        <Loader2 className="spin" size={18} /> Loading runs…
      </div>
    );
  }
  if (error) {
    return (
      <div className="eval-error">
        {error} <Button size="sm" onClick={refresh}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="eval-section">
      <div className="eval-section-head">
        <h3 className="eval-section-title">Runs</h3>
        <Button size="sm" variant="primary" onClick={() => setLaunching(true)}>
          <Play size={14} /> New run
        </Button>
      </div>

      {runs.length === 0 ? (
        <div className="eval-empty">
          <Play size={28} />
          <p>No runs yet. Launch a run to evaluate a model against a dataset.</p>
        </div>
      ) : (
        <ul className="eval-list">
          {runs.map((run) => {
            const pct = run.total_cases ? Math.round((run.completed_cases / run.total_cases) * 100) : 0;
            const summary = run.summary as unknown as { passRate?: number; avgScore?: number } | null;
            return (
              <li key={run.id} className="run-item" onClick={() => setActiveRunId(run.id)}>
                <div className="run-item-main">
                  <span className={`run-badge ${STATUS_VARIANT[run.status]}`}>{run.status}</span>
                  <span className="run-model">{run.model}</span>
                  {run.is_baseline && <Star size={12} className="run-baseline-star" fill="currentColor" />}
                </div>
                {(run.status === 'running' || run.status === 'queued') && (
                  <div className="run-progress">
                    <div className="run-progress-bar" style={{ width: `${pct}%` }} />
                    <span className="run-progress-label">
                      {run.completed_cases}/{run.total_cases}
                    </span>
                  </div>
                )}
                {run.status === 'completed' && summary && (
                  <div className="run-stats">
                    <span>Pass {Math.round((summary.passRate ?? 0) * 100)}%</span>
                    <span>Avg {(summary.avgScore ?? 0).toFixed(2)}</span>
                  </div>
                )}
                <div className="run-actions" onClick={(e) => e.stopPropagation()}>
                  <button
                    className="eval-icon-btn"
                    aria-label="Toggle baseline"
                    title="Set as baseline"
                    onClick={() => toggleBaseline(run)}
                  >
                    <Star size={14} fill={run.is_baseline ? 'currentColor' : 'none'} />
                  </button>
                  {run.status === 'completed' && (
                    <button
                      className="eval-icon-btn"
                      aria-label="Diff vs baseline"
                      title="Diff vs baseline"
                      onClick={() => diff(run)}
                    >
                      <GitCompare size={14} />
                    </button>
                  )}
                  {(run.status === 'running' || run.status === 'queued') && (
                    <button
                      className="eval-icon-btn"
                      aria-label="Cancel run"
                      title="Cancel"
                      onClick={async () => {
                        await cancelRun(run.id);
                        refresh();
                      }}
                    >
                      <StopCircle size={14} />
                    </button>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      )}

      <RunLauncherModal
        open={launching}
        projectId={projectId}
        onClose={() => setLaunching(false)}
        onLaunched={() => {
          setLaunching(false);
          refresh();
        }}
      />
    </div>
  );
}

function RunLauncherModal({
  open,
  projectId,
  onClose,
  onLaunched,
}: {
  open: boolean;
  projectId: string;
  onClose: () => void;
  onLaunched: () => void;
}) {
  const [datasets, setDatasets] = useState<DatasetRow[]>([]);
  const [rubrics, setRubrics] = useState<RubricRow[]>([]);
  const [datasetId, setDatasetId] = useState('');
  const [rubricId, setRubricId] = useState('');
  const [models, setModels] = useState('gemini-2.5-flash');
  const [isBaseline, setIsBaseline] = useState(false);
  const [busy, setBusy] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  useEffect(() => {
    if (!open) return;
    (async () => {
      const [d, r] = await Promise.all([listDatasets(projectId), listRubrics(projectId)]);
      if (d.ok) setDatasets(d.data);
      if (r.ok) setRubrics(r.data);
    })();
  }, [open, projectId]);

  async function launch() {
    const modelList = models.split(',').map((m) => m.trim()).filter(Boolean);
    if (!datasetId || !rubricId || modelList.length === 0) return;
    setBusy(true);
    const res = await startRun({ projectId, datasetId, rubricId, models: modelList, isBaseline });
    setBusy(false);
    if (res.ok) {
      addToast({ title: `Run started (${res.data.runIds.length} model(s))`, variant: 'success' });
      onLaunched();
    } else {
      addToast(`Run failed to start — ${res.error}`, 'error');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="New evaluation run" size="md">
      <div className="eval-form">
        <label className="field-label">Dataset</label>
        <select className="input" value={datasetId} onChange={(e) => setDatasetId(e.target.value)}>
          <option value="">Select a dataset…</option>
          {datasets.map((d) => (
            <option key={d.id} value={d.id}>
              {d.name} ({d.case_count ?? 0} cases)
            </option>
          ))}
        </select>

        <label className="field-label">Rubric</label>
        <select className="input" value={rubricId} onChange={(e) => setRubricId(e.target.value)}>
          <option value="">Select a rubric…</option>
          {rubrics.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name}
            </option>
          ))}
        </select>

        <Input
          label="Models (comma-separated for multi-model compare)"
          value={models}
          onChange={(e) => setModels(e.target.value)}
          placeholder="gemini-2.5-flash, gemini-2.5-pro"
        />

        <label className="eval-checkbox">
          <input type="checkbox" checked={isBaseline} onChange={(e) => setIsBaseline(e.target.checked)} />
          Mark as baseline
        </label>

        <div className="eval-form-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={launch} disabled={!datasetId || !rubricId || busy}>
            {busy ? 'Starting…' : 'Run evaluation'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
