'use client';

import { useProjectStore } from '@/lib/stores/project-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { EmptyCanvas } from './empty-canvas';
import { RadialRing } from './radial-ring';
import { WorkspacePlate } from './workspace-plate';

export function CanvasShell() {
  const project = useProjectStore((s) => s.project);
  const globalState = useUIStore((s) => s.globalState);
  const focusedDomainId = useUIStore((s) => s.focusedDomainId);

  return (
    <main className="canvas-shell">
      {!project && globalState === 'empty' ? (
        <EmptyCanvas />
      ) : (
        <>
          <RadialRing />
          {focusedDomainId && <WorkspacePlate />}
        </>
      )}
    </main>
  );
}
