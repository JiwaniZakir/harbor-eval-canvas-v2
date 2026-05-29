'use client';

import { useEffect, useState } from 'react';
import { ArrowLeft, Loader2, CheckCircle2, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useEvalUIStore } from '@/lib/stores/eval-ui-store';
import { getRunCases, listRuns, type RunCaseRow, type RunRow } from '@/lib/actions/runs';

export function RunDetail({ projectId, runId }: { projectId: string; runId: string }) {
  const [run, setRun] = useState<RunRow | null>(null);
  const [cases, setCases] = useState<RunCaseRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState<RunCaseRow | null>(null);
  const setActiveRunId = useEvalUIStore((s) => s.setActiveRunId);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const [runsRes, casesRes] = await Promise.all([listRuns(projectId), getRunCases(runId)]);
      if (runsRes.ok) setRun(runsRes.data.find((r) => r.id === runId) ?? null);
      if (casesRes.ok) setCases(casesRes.data);
      setLoading(false);
    })();
  }, [projectId, runId]);

  const summary = run?.summary as
    | { total?: number; passRate?: number; avgScore?: number; avgLatencyMs?: number; totalCostUsd?: number }
    | null;

  return (
    <div className="eval-section">
      <button className="eval-back" onClick={() => setActiveRunId(null)}>
        <ArrowLeft size={14} /> Back to runs
      </button>

      {loading ? (
        <div className="eval-loading">
          <Loader2 className="spin" size={18} /> Loading run…
        </div>
      ) : (
        <>
          {run && (
            <div className="run-detail-head">
              <h3 className="eval-section-title">{run.model}</h3>
              <span className={`run-badge run-badge-${run.status}`}>{run.status}</span>
            </div>
          )}

          {summary && (
            <div className="run-summary-grid">
              <Stat label="Cases" value={String(summary.total ?? cases.length)} />
              <Stat label="Pass rate" value={`${Math.round((summary.passRate ?? 0) * 100)}%`} />
              <Stat label="Avg score" value={(summary.avgScore ?? 0).toFixed(2)} />
              <Stat label="Avg latency" value={`${Math.round(summary.avgLatencyMs ?? 0)}ms`} />
              <Stat label="Total cost" value={`$${(summary.totalCostUsd ?? 0).toFixed(4)}`} />
            </div>
          )}

          {cases.length === 0 ? (
            <div className="eval-empty">
              <p>No cases recorded for this run yet.</p>
            </div>
          ) : (
            <table className="run-table">
              <thead>
                <tr>
                  <th>Input</th>
                  <th>Response</th>
                  <th>Score</th>
                  <th>Result</th>
                  <th>Latency</th>
                </tr>
              </thead>
              <tbody>
                {cases.map((c) => (
                  <tr key={c.id} onClick={() => setActive(c)} className="run-table-row">
                    <td className="run-cell-truncate">{c.input}</td>
                    <td className="run-cell-truncate">{c.response}</td>
                    <td>{c.score?.toFixed(2) ?? '—'}</td>
                    <td>
                      {c.passed ? (
                        <CheckCircle2 size={14} className="run-pass" />
                      ) : (
                        <XCircle size={14} className="run-fail" />
                      )}
                    </td>
                    <td>{c.latency_ms ?? 0}ms</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      <TraceModal active={active} onClose={() => setActive(null)} />
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="run-stat-card">
      <div className="run-stat-value">{value}</div>
      <div className="run-stat-label">{label}</div>
    </div>
  );
}

function TraceModal({ active, onClose }: { active: RunCaseRow | null; onClose: () => void }) {
  const breakdown = (active?.scorer_breakdown as unknown as
    | Array<{ scorerId: string; score: number; passed: boolean; rationale?: string; weight: number }>
    | null) ?? [];
  return (
    <Dialog open={!!active} onClose={onClose} title="Case trace" size="lg">
      {active && (
        <div className="trace">
          <section>
            <h4 className="trace-label">Input / Prompt</h4>
            <pre className="trace-pre">{active.input}</pre>
          </section>
          <section>
            <h4 className="trace-label">Response</h4>
            <pre className="trace-pre">{active.response ?? '(none)'}</pre>
          </section>
          <section>
            <h4 className="trace-label">Scorers</h4>
            {breakdown.length === 0 ? (
              <p className="eval-hint">{active.scorer_rationale ?? 'No breakdown.'}</p>
            ) : (
              <ul className="trace-scorers">
                {breakdown.map((b, i) => (
                  <li key={i}>
                    <span className="trace-scorer-name">{b.scorerId}</span>
                    <span className={b.passed ? 'run-pass' : 'run-fail'}>{b.score.toFixed(2)}</span>
                    {b.rationale && <span className="trace-rationale">{b.rationale}</span>}
                  </li>
                ))}
              </ul>
            )}
          </section>
          <div className="trace-meta">
            <span>Latency {active.latency_ms ?? 0}ms</span>
            <span>Cost ${(active.cost_usd ?? 0).toFixed(5)}</span>
          </div>
          <div className="eval-form-actions">
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      )}
    </Dialog>
  );
}
