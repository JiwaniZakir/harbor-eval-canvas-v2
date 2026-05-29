'use client';

import { useEffect, useState } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { DetailPanel } from '@/components/layout/detail-panel';
import { CanvasShell } from '@/components/canvas/canvas-shell';
import { ProjectSetup } from '@/components/studio/project-setup';
import { CommandPaletteModal } from '@/components/studio/command-palette-modal';
import { EvalDrawer } from '@/components/eval/eval-drawer';
import { ToastStack } from '@/components/layout/toast-stack';
import { ErrorBoundary } from '@/components/layout/error-boundary';
import { useProjectStore } from '@/lib/stores/project-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import type { TabId } from '@/lib/types';

const TAB_KEYS: Record<string, TabId> = {
  '1': 'home',
  '2': 'agent',
  '3': 'project',
  '4': 'files',
  '5': 'sweeps',
};

export default function Home() {
  const [hydrated, setHydrated] = useState(false);
  const project = useProjectStore((s) => s.project);
  const hydrateProject = useProjectStore((s) => s.hydrate);
  const hydrateDomains = useDomainStore((s) => s.hydrate);
  const globalState = useUIStore((s) => s.globalState);
  const setGlobalState = useUIStore((s) => s.setGlobalState);
  const setSetupWizardOpen = useUIStore((s) => s.setSetupWizardOpen);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  // Hydration: localStorage cache rehydrates synchronously; then we fetch the
  // authoritative state from Postgres and reconcile (source of truth = DB).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      await hydrateProject();
      if (cancelled) return;
      const proj = useProjectStore.getState().project;
      if (proj?.id) {
        await hydrateDomains(proj.id);
      }
      if (!cancelled) setHydrated(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [hydrateProject, hydrateDomains]);

  // Initialize state based on project presence
  useEffect(() => {
    if (!hydrated) return;
    if (project) {
      setGlobalState('canvas_idle');
    } else {
      setGlobalState('empty');
    }
  }, [project, setGlobalState, hydrated]);

  // Global keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't fire shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) {
        return;
      }

      // Number keys for tab switching
      if (TAB_KEYS[e.key]) {
        e.preventDefault();
        setActiveTab(TAB_KEYS[e.key]);
      }
    };

    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [setActiveTab]);

  // Prevent SSR/CSR mismatch flash: show skeleton until hydrated
  if (!hydrated) {
    return (
      <div className="app-layout" style={{ opacity: 0 }}>
        <div style={{ gridArea: 'topbar', height: 'var(--topbar-height)' }} />
        <div style={{ gridArea: 'canvas' }} />
        <div style={{ gridArea: 'panel' }} />
        <div style={{ gridArea: 'bottomnav', height: 'var(--bottom-height)' }} />
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="app-layout" style={{ animation: 'sd-fadeIn 300ms var(--ease-smooth)' }}>
        <TopBar />
        <CanvasShell />
        <DetailPanel />
        <BottomNav />
      </div>

      {/* Overlays */}
      <ProjectSetup />
      <CommandPaletteModal />
      <ToastStack />
    </ErrorBoundary>
  );
}
