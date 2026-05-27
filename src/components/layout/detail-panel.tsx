'use client';

import { Suspense, lazy } from 'react';
import { useUIStore } from '@/lib/stores/ui-store';
import type { TabId } from '@/lib/types';
import {
  HomeTabSkeleton,
  AgentTabSkeleton,
  ProjectTabSkeleton,
  FilesTabSkeleton,
  SweepsTabSkeleton,
} from '@/components/ui/skeleton-loading';

// Lazy-loaded tabs for code splitting
const HomeTab = lazy(() => import('@/components/panel/home-tab').then((m) => ({ default: m.HomeTab })));
const AgentTab = lazy(() => import('@/components/panel/agent-tab').then((m) => ({ default: m.AgentTab })));
const ProjectTab = lazy(() => import('@/components/panel/project-tab').then((m) => ({ default: m.ProjectTab })));
const FilesTab = lazy(() => import('@/components/panel/files-tab').then((m) => ({ default: m.FilesTab })));
const SweepsTab = lazy(() => import('@/components/panel/sweeps-tab').then((m) => ({ default: m.SweepsTab })));

const TAB_LABELS: { id: TabId; label: string }[] = [
  { id: 'home', label: 'Home' },
  { id: 'agent', label: 'Agent' },
  { id: 'project', label: 'Project' },
  { id: 'files', label: 'Files' },
  { id: 'sweeps', label: 'Sweeps' },
];

const TAB_SKELETONS: Record<TabId, React.ReactNode> = {
  home: <HomeTabSkeleton />,
  agent: <AgentTabSkeleton />,
  project: <ProjectTabSkeleton />,
  files: <FilesTabSkeleton />,
  sweeps: <SweepsTabSkeleton />,
};

function TabContent({ tab }: { tab: TabId }) {
  switch (tab) {
    case 'home':
      return <HomeTab />;
    case 'agent':
      return <AgentTab />;
    case 'project':
      return <ProjectTab />;
    case 'files':
      return <FilesTab />;
    case 'sweeps':
      return <SweepsTab />;
  }
}

export function DetailPanel() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  return (
    <aside className="detail-panel">
      <div className="panel-tab-strip">
        {TAB_LABELS.map((tab) => (
          <button
            key={tab.id}
            className="panel-tab"
            data-active={activeTab === tab.id || undefined}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="panel-content">
        <Suspense fallback={TAB_SKELETONS[activeTab]}>
          <TabContent tab={activeTab} />
        </Suspense>
      </div>
    </aside>
  );
}
