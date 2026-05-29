'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, Trash2, Database, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { useToastStore } from '@/lib/stores/toast-store';
import {
  listDatasets,
  createDataset,
  deleteDataset,
  type DatasetRow,
} from '@/lib/actions/datasets';
import { parseCasesCSV, parseCasesJSON, type ParsedCase } from '@/lib/eval/parse-cases';

export function DatasetsPanel({ projectId }: { projectId: string }) {
  const [datasets, setDatasets] = useState<DatasetRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  const refresh = useCallback(async () => {
    setLoading(true);
    const res = await listDatasets(projectId);
    if (res.ok) setDatasets(res.data);
    else setError(res.error);
    setLoading(false);
  }, [projectId]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  if (loading) {
    return (
      <div className="eval-loading">
        <Loader2 className="spin" size={18} /> Loading datasets…
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
        <h3 className="eval-section-title">Datasets</h3>
        <Button size="sm" variant="primary" onClick={() => setCreating(true)}>
          <Plus size={14} /> New dataset
        </Button>
      </div>

      {datasets.length === 0 ? (
        <div className="eval-empty">
          <Database size={28} />
          <p>No datasets yet. Create one to define your test cases.</p>
        </div>
      ) : (
        <ul className="eval-list">
          {datasets.map((d) => (
            <li key={d.id} className="eval-list-item">
              <div>
                <div className="eval-list-name">{d.name}</div>
                <div className="eval-list-meta">{d.case_count ?? 0} cases</div>
              </div>
              <button
                className="eval-icon-btn"
                aria-label={`Delete ${d.name}`}
                onClick={async () => {
                  const res = await deleteDataset(d.id);
                  if (res.ok) {
                    setDatasets((prev) => prev.filter((x) => x.id !== d.id));
                    addToast('Dataset deleted', 'success');
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

      <CreateDatasetModal
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

function CreateDatasetModal({
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
  const [raw, setRaw] = useState('');
  const [format, setFormat] = useState<'csv' | 'json'>('csv');
  const [parsed, setParsed] = useState<ParsedCase[]>([]);
  const [parseError, setParseError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const addToast = useToastStore((s) => s.addToast);

  function tryParse(value: string, fmt: 'csv' | 'json') {
    setRaw(value);
    if (!value.trim()) {
      setParsed([]);
      setParseError(null);
      return;
    }
    try {
      const cases = fmt === 'csv' ? parseCasesCSV(value) : parseCasesJSON(value);
      setParsed(cases);
      setParseError(null);
    } catch (e) {
      setParsed([]);
      setParseError((e as Error).message);
    }
  }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    const fmt = file.name.endsWith('.json') ? 'json' : 'csv';
    setFormat(fmt);
    tryParse(text, fmt);
  }

  async function save() {
    if (!name.trim()) return;
    setSaving(true);
    const res = await createDataset({ projectId, name: name.trim(), cases: parsed });
    setSaving(false);
    if (res.ok) {
      addToast('Dataset created', 'success');
      setName('');
      setRaw('');
      setParsed([]);
      onCreated();
    } else {
      addToast(`Create failed — ${res.error}`, 'error');
    }
  }

  return (
    <Dialog open={open} onClose={onClose} title="New dataset">
      <div className="eval-form">
        <label className="field-label">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Instruction-following probes"
        />
        <div className="eval-format-tabs">
          <button
            className={format === 'csv' ? 'active' : ''}
            onClick={() => tryParse(raw, 'csv')}
          >
            CSV
          </button>
          <button
            className={format === 'json' ? 'active' : ''}
            onClick={() => tryParse(raw, 'json')}
          >
            JSON
          </button>
          <label className="eval-file-btn">
            Upload file
            <input type="file" accept=".csv,.json" onChange={onFile} hidden />
          </label>
        </div>
        <textarea
          className="eval-textarea"
          rows={8}
          value={raw}
          onChange={(e) => tryParse(e.target.value, format)}
          placeholder={
            format === 'csv'
              ? 'input,expected\nWhat is 2+2?,4'
              : '[{"input":"What is 2+2?","expected":"4"}]'
          }
        />
        {parseError ? (
          <p className="field-error">{parseError}</p>
        ) : (
          <p className="eval-hint">{parsed.length} case(s) parsed.</p>
        )}
        <div className="eval-form-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={save} disabled={!name.trim() || saving}>
            {saving ? 'Creating…' : 'Create dataset'}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
