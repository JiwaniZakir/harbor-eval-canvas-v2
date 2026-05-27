'use client';

import { House, MessageCircle, FolderKanban, FileCode2, BarChart3 } from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import type { TabId } from '@/lib/types';

const TABS: { id: TabId; label: string; icon: typeof House }[] = [
  { id: 'home', label: 'Home', icon: House },
  { id: 'agent', label: 'Agent', icon: MessageCircle },
  { id: 'project', label: 'Project', icon: FolderKanban },
  { id: 'files', label: 'Files', icon: FileCode2 },
  { id: 'sweeps', label: 'Sweeps', icon: BarChart3 },
];

export function BottomNav() {
  const activeTab = useUIStore((s) => s.activeTab);
  const setActiveTab = useUIStore((s) => s.setActiveTab);

  return (
    <nav className="bottom-nav">
      {TABS.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            className="bottom-nav-tab"
            data-active={isActive || undefined}
            onClick={() => setActiveTab(tab.id)}
            aria-label={tab.label}
            aria-keyshortcuts={`${TABS.indexOf(tab) + 1}`}
          >
            <Icon className="bottom-nav-icon" />
            <span className="bottom-nav-label">{tab.label}</span>
            {tab.id === 'sweeps' && <span className="bottom-nav-badge" />}
          </button>
        );
      })}
    </nav>
  );
}
