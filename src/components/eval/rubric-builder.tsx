'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, ClipboardList, Loader2, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToastStore } from '@/lib/stores/toast-store';
import { listRubrics, createRubric, deleteRubric, type RubricRow } from '@/lib/actions/rubrics';
import { SCORER_LABELS } from '@/lib/eval/scorers';
import type { ScorerType } from '@/lib/eval/scorers/types';

const SCORER_IDS = Object.keys(SCORER_LABELS) as ScorerType[];

interface DraftScorer {
  scorerId: ScorerType;
  weight: number;
  threshold?: number;
  config: Record<string, unknown>;
}

export function RubricBuilder({ projectId }: { projectId: string }) {
  const [rubrics, setRubrics] = useState<RubricRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await listRubrics(projectId);
    if (res.ok) setRubrics(res.data);
    else setError(res.error);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className="eval-loading">
        <Loader2 className="spin" size={18} /> Loading rubrics…
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
        <h3 className="eval-section-title">Rubrics</h3>
        <Button size="sm" variant="primary" onClick={() => setCreating(true)}>
          <Plus size={14} /> New rubric
        </Button>
      </div>

      {rubrics.length === 0 ? (
        <div className="eval-empty">
          <ClipboardList size={28} />
          <p>No rubrics yet. A rubric is a weighted set of scorers.</p>
        </div>
      ) : (
        <ul className="eval-list">
          {rubrics.map((r) => (
            <li key={r.id} className="eval-list-item">
              <div>
                <div className="eval-list-name">{r.name}</div>
                <div className="eval-list-meta">
                  {r.scorers.map((s) => SCORER_LABELS[s.scorerId as ScorerType] ?? s.scorerId).join(', ')}
                </div>
              </div>
              <button
                className="eval-icon-btn"
                aria-label={`Delete ${r.name}`}
                onClick={async () => {
                  const res = await deleteRubric(r.id);
                  if (res.ok) {
                    setRubrics((prev) => prev.filter((x) => x.id !== r.id));
                    addToast('Rubric deleted', 'success');
                  } else {
                    addToast(`Delete failed — ${res.error}`, 'error');
                  }
                }}
              >
                <Trash2 size={14} />
              </button>
            </li>
          ))}
        </ul>
      )}

      <CreateRubricModal
        open={creating}
        projectId={projectId}
        onClose={() => setCreating(false)}
        onCreated={() => {
          setCreating(false);
          refresh();
        }}
      />
    </div>
  );
}

function CreateRubricModal({
  open,
  projectId,
  onClose,
  onCreated,
}: {
  open: boolean;
  projectId: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [name, setName] = useState('');
  const [scorers, setScorers] = useState<DraftScorer[]>([
    { scorerId: 'contains', weight: 1, config: {} },
  ]);
  const [saving, setSaving] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  function update(i: number, patch: Partial<DraftScorer>) {
    setScorers((prev) => prev.map((s, idx) => (idx === i ? { ...s, ...patch } : s)));
  }

  async function save() {
    if (!name.trim() || scorers.length === 0) return;
    setSaving(true);
    const res = await createRubric({
      projectId,
      name: name.trim(),
      scorers: scorers.map((s) => ({
        scorerId: s.scorerId,
        weight: s.weight,
        threshold: s.threshold,
        config: s.config,
      })),
    });
    setSaving(false);
    if (res.ok) {
      addToast('Rubric created', 'success');
      setName('');
      setScorers([{ scorerId: 'contains', weight: 1, config: {} }]);
      onCreated();
    } else {
      addToast(`Create failed — ${res.error}`, 'error');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="New rubric" size="lg">
      <div className="eval-form">
        <Input
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Correctness + format"
        />

        <div className="eval-scorers">
          {scorers.map((s, i) => (
            <div key={i} className="eval-scorer-row">
              <select
                aria-label="Scorer type"
                value={s.scorerId}
                onChange={(e) => update(i, { scorerId: e.target.value as ScorerType })}
              >
                {SCORER_IDS.map((id) => (
                  <option key={id} value={id}>
                    {SCORER_LABELS[id]}
                  </option>
                ))}
              </select>
              <input
                aria-label="Weight"
                className="input eval-weight"
                type="number"
                min={0.1}
                step={0.1}
                value={s.weight}
                onChange={(e) => update(i, { weight: Number(e.target.value) })}
              />
              {s.scorerId === 'regex' && (
                <input
                  aria-label="Regex pattern"
                  className="input"
                  placeholder="pattern"
                  value={(s.config.pattern as string) ?? ''}
                  onChange={(e) => update(i, { config: { ...s.config, pattern: e.target.value } })}
                />
              )}
              {s.scorerId === 'json_schema' && (
                <input
                  aria-label="JSON schema"
                  className="input"
                  placeholder='{"type":"object",...}'
                  value={(s.config.schemaText as string) ?? ''}
                  onChange={(e) => {
                    const v = e.target.value;
                    let schema: unknown;
                    try {
                      schema = JSON.parse(v);
                    } catch {
                      schema = undefined;
                    }
                    update(i, { config: { ...s.config, schemaText: v, schema } });
                  }}
                />
              )}
              {s.scorerId === 'llm_judge' && (
                <input
                  aria-label="Grading criteria"
                  className="input"
                  placeholder="grading criteria (optional)"
                  value={(s.config.criteria as string) ?? ''}
                  onChange={(e) => update(i, { config: { ...s.config, criteria: e.target.value } })}
                />
              )}
              <button
                className="eval-icon-btn"
                aria-label="Remove scorer"
                onClick={() => setScorers((prev) => prev.filter((_, idx) => idx !== i))}
                disabled={scorers.length === 1}
              >
                <X size={14} />
              </button>
            </div>
          ))}
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setScorers((prev) => [...prev, { scorerId: 'exact_match', weight: 1, config: {} }])}
          >
            <Plus size={14} /> Add scorer
          </Button>
        </div>

        <div className="eval-form-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save} disabled={!name.trim() || saving}>
            {saving ? 'Creating…' : 'Create rubric'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
