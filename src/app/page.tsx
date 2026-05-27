'use client';

import { useEffect } from 'react';
import { TopBar } from '@/components/layout/top-bar';
import { BottomNav } from '@/components/layout/bottom-nav';
import { DetailPanel } from '@/components/layout/detail-panel';
import { CanvasShell } from '@/components/canvas/canvas-shell';
import { ProjectSetup } from '@/components/studio/project-setup';
import { CommandPaletteModal } from '@/components/studio/command-palette-modal';
import { ToastStack } from '@/components/layout/toast-stack';
import { ErrorBoundary } from '@/components/layout/error-boundary';
import { useProjectStore } from '@/lib/stores/project-store';
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
  const project = useProjectStore((s) => s.project);
  const globalState = useUIStore((s) => s.globalState);
  const setGlobalState = useUIStore((s) => s.setGlobalState);
  const setSetupWizardOpen = useUIStore((s) => s.setSetupWizardOpen);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  // Initialize state based on project presence
  useEffect(() => {
    if (project) {
      setGlobalState('canvas_idle');
    } else {
      setGlobalState('empty');
    }
  }, [project, setGlobalState]);

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

  return (
    <ErrorBoundary>
      <div className="app-layout">
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
