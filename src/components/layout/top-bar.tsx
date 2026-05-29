'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Settings, Plus, LogOut, Download, Upload, FlaskConical } from 'lucide-react';
import { useProjectStore } from '@/lib/stores/project-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { useEvalUIStore } from '@/lib/stores/eval-ui-store';
import { useToastStore } from '@/lib/stores/toast-store';
import { DOMAIN_META, PROVIDER_COLORS } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';
import { exportProject, importProject } from '@/lib/actions/project-io';

export function TopBar() {
  const router = useRouter();
  const project = useProjectStore((s) => s.project);
  const hydrateProject = useProjectStore((s) => s.hydrate);
  const hydrateDomains = useDomainStore((s) => s.hydrate);
  const focusedDomainId = useUIStore((s) => s.focusedDomainId);
  const dropdownOpen = useUIStore((s) => s.projectDropdownOpen);
  const setDropdownOpen = useUIStore((s) => s.setProjectDropdownOpen);
  const setSetupWizardOpen = useUIStore((s) => s.setSetupWizardOpen);
  const openEvals = useEvalUIStore((s) => s.openTo);
  const addToast = useToastStore((s) => s.addToast);
  const [signingOut, setSigningOut] = useState(false);
  const [busy, setBusy] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.replace('/login');
    router.refresh();
  }

  async function handleExport() {
    setDropdownOpen(false);
    if (!project?.id) {
      addToast('Nothing to export yet — create a project first', 'warning');
      return;
    }
    setBusy(true);
    const res = await exportProject(project.id);
    setBusy(false);
    if (!res.ok) {
      addToast(`Export failed: ${res.error}`, 'error');
      return;
    }
    const blob = new Blob([JSON.stringify(res.data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    const safeName = (project.name || 'project').replace(/[^a-z0-9-_]+/gi, '_');
    a.href = url;
    a.download = `${safeName}.harbor.json`;
    a.click();
    URL.revokeObjectURL(url);
    addToast('Project exported', 'success');
  }

  function handleImportClick() {
    setDropdownOpen(false);
    fileInputRef.current?.click();
  }

  async function handleImportFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-importing the same file
    if (!file) return;
    setBusy(true);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await importProject(json);
      if (!res.ok) {
        addToast(`Import failed: ${res.error}`, 'error');
        return;
      }
      // Rehydrate from the server so the imported project becomes active.
      await hydrateProject();
      const proj = useProjectStore.getState().project;
      if (proj?.id) await hydrateDomains(proj.id);
      addToast('Project imported', 'success');
    } catch {
      addToast('Import failed: invalid JSON file', 'error');
    } finally {
      setBusy(false);
    }
  }

  // Close dropdown on outside click
  useEffect(() => {
    if (!dropdownOpen) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [dropdownOpen, setDropdownOpen]);

  const domainMeta = focusedDomainId ? DOMAIN_META[focusedDomainId] : null;

  return (
    <header className="topbar">
      <div className="topbar-left">
        <div className="topbar-avatar">ZJ</div>

        <div ref={dropdownRef} style={{ position: 'relative' }}>
          <button
            className="topbar-project"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          >
            <span className="topbar-project-name">
              {project?.name || 'Harbor Eval'}
            </span>
            <ChevronDown className="topbar-project-chevron" />
          </button>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button
                className="dropdown-item"
                onClick={() => {
                  setSetupWizardOpen(true);
                  setDropdownOpen(false);
                }}
              >
                <Plus size={14} />
                New Project
              </button>
              <div className="dropdown-separator" />
              <button
                className="dropdown-item"
                onClick={handleExport}
                disabled={busy || !project?.id}
              >
                <Download size={14} />
                Export Project
              </button>
              <button
                className="dropdown-item"
                onClick={handleImportClick}
                disabled={busy}
              >
                <Upload size={14} />
                Import Project
              </button>
              <div className="dropdown-separator" />
              <button className="dropdown-item">
                <Settings size={14} />
                Settings
              </button>
              <button
                className="dropdown-item"
                onClick={handleSignOut}
                disabled={signingOut}
              >
                <LogOut size={14} />
                {signingOut ? 'Signing out…' : 'Sign Out'}
              </button>
            </div>
          )}
        </div>

        {domainMeta && (
          <div className="topbar-breadcrumb">
            <ChevronRight className="topbar-breadcrumb-separator" />
            <span className="topbar-breadcrumb-domain">{domainMeta.label}</span>
          </div>
        )}
      </div>

      <div className="topbar-right">
        {project?.targetModel && (
          <div className="topbar-model-pill">
            <span
              className="topbar-model-dot"
              style={{
                backgroundColor:
                  PROVIDER_COLORS[project.targetModel.provider] || 'var(--fg-40)',
              }}
            />
            <span className="topbar-model-name">
              {project.targetModel.modelSlug}
            </span>
          </div>
        )}

        <button
          className="topbar-evals"
          onClick={() => openEvals('runs')}
          aria-label="Open evaluations"
          title="Evaluations"
        >
          <FlaskConical size={14} />
          <span>Evaluations</span>
        </button>

        <button className="topbar-settings" aria-label="Settings">
          <Settings size={18} />
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="application/json,.json"
        style={{ display: 'none' }}
        onChange={handleImportFile}
      />
    </header>
  );
}
