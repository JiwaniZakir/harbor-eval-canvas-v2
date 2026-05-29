'use client';

import { useEffect, useState, useCallback } from 'react';
import { Loader2, GitCompare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  listRuns,
  compareRuns,
  type RunRow,
  type CompareMatrix,
} from '@/lib/actions/runs';

/**
 * Multi-model compare matrix (C7). Pick completed runs and view per-model
 * aggregates plus a per-case score grid that highlights the winning model.
 */
export function ModelCompareView({ projectId }: { projectId: string }) {
  const [runs, setRuns] = useState<RunRow[]>([]);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [matrix, setMatrix] = useState<CompareMatrix | null>(null);
  const [loading, setLoading] = useState(true);
  const [comparing, setComparing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const res = await listRuns(projectId);
      if (res.ok) setRuns(res.data.filter((r) => r.status === 'completed'));
      else setError(res.error);
      setLoading(false);
    })();
  }, [projectId]);

  const toggle = useCallback((id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }, []);

  async function run() {
    setComparing(true);
    setError(null);
    const res = await compareRuns(Array.from(selected));
    setComparing(false);
    if (res.ok) setMatrix(res.data);
    else setError(res.error);
  }

  if (loading) {
    return (
      <div className="eval-loading">
        <Loader2 className="spin" size={18} /> Loading runs…
      </div>
    );
  }

  return (
    <div className="eval-section">
      <div className="eval-section-head">
        <h3 className="eval-section-title">Compare models</h3>
        <Button
          size="sm"
          variant="primary"
          disabled={selected.size < 2 || comparing}
          onClick={run}
        >
          <GitCompare size={14} /> {comparing ? 'Comparing…' : `Compare (${selected.size})`}
        </Button>
      </div>

      {error && <div className="eval-error">{error}</div>}

      {runs.length === 0 ? (
        <div className="eval-empty">
          <GitCompare size={28} />
          <p>No completed runs yet. Launch runs (optionally with multiple models) to compare.</p>
        </div>
      ) : (
        <ul className="eval-list compare-pick">
          {runs.map((r) => {
            const summary = r.summary as unknown as { passRate?: number; avgScore?: number } | null;
            return (
              <li key={r.id} className="eval-list-item">
                <label className="compare-pick-label">
                  <input
                    type="checkbox"
                    checked={selected.has(r.id)}
                    onChange={() => toggle(r.id)}
                  />
                  <span className="eval-list-name">{r.model}</span>
                  {summary && (
                    <span className="eval-list-meta">
                      Pass {Math.round((summary.passRate ?? 0) * 100)}% · Avg{' '}
                      {(summary.avgScore ?? 0).toFixed(2)}
                    </span>
                  )}
                </label>
              </li>
            );
          })}
        </ul>
      )}

      {matrix && <CompareMatrixView matrix={matrix} />}
    </div>
  );
}

function CompareMatrixView({ matrix }: { matrix: CompareMatrix }) {
  const fmtUsd = (n: number) => (n < 0.01 ? `$${n.toFixed(4)}` : `$${n.toFixed(2)}`);
  // Determine the winning run per case (highest score) for highlight.
  const bestByCase = new Map<string, string>();
  for (const c of matrix.cases) {
    let bestRun = '';
    let bestScore = -Infinity;
    for (const [runId, score] of Object.entries(c.scores)) {
      if (score != null && score > bestScore) {
        bestScore = score;
        bestRun = runId;
      }
    }
    if (bestRun) bestByCase.set(c.caseId, bestRun);
  }

  return (
    <div className="compare-results">
      <table className="compare-table">
        <thead>
          <tr>
            <th>Metric</th>
            {matrix.models.map((m) => (
              <th key={m.runId}>{m.model}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Pass rate</td>
            {matrix.models.map((m) => (
              <td key={m.runId}>{Math.round(m.passRate * 100)}%</td>
            ))}
          </tr>
          <tr>
            <td>Avg score</td>
            {matrix.models.map((m) => (
              <td key={m.runId}>{m.avgScore.toFixed(3)}</td>
            ))}
          </tr>
          <tr>
            <td>Avg latency</td>
            {matrix.models.map((m) => (
              <td key={m.runId}>{Math.round(m.avgLatencyMs)}ms</td>
            ))}
          </tr>
          <tr>
            <td>Total cost</td>
            {matrix.models.map((m) => (
              <td key={m.runId}>{fmtUsd(m.totalCostUsd)}</td>
            ))}
          </tr>
        </tbody>
      </table>

      <h4 className="compare-subhead">Per-case scores</h4>
      <table className="compare-table compare-cases">
        <thead>
          <tr>
            <th>Case</th>
            {matrix.models.map((m) => (
              <th key={m.runId}>{m.model}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {matrix.cases.map((c) => (
            <tr key={c.caseId}>
              <td className="compare-case-input" title={c.input}>
                {c.input}
              </td>
              {matrix.models.map((m) => {
                const score = c.scores[m.runId];
                const isBest = bestByCase.get(c.caseId) === m.runId && matrix.models.length > 1;
                return (
                  <td key={m.runId} className={isBest ? 'compare-best' : undefined}>
                    {score != null ? score.toFixed(2) : '—'}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
