'use client';

import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  Search, Home, MessageCircle, FolderKanban, FileCode2,
  BarChart3, Plus, RotateCcw, Download,
} from 'lucide-react';
import { useUIStore } from '@/lib/stores/ui-store';
import { ALL_DOMAIN_IDS, DOMAIN_META } from '@/lib/types';
import type { TabId, DomainId } from '@/lib/types';

interface CommandItem {
  id: string;
  label: string;
  group: string;
  icon: React.ReactNode;
  shortcut?: string;
  action: () => void;
}

export function CommandPaletteModal() {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const open = useUIStore((s) => s.commandPaletteOpen);
  const setOpen = useUIStore((s) => s.setCommandPaletteOpen);
  const setActiveTab = useUIStore((s) => s.setActiveTab);
  const setFocusedDomain = useUIStore((s) => s.setFocusedDomain);
  const setSetupWizardOpen = useUIStore((s) => s.setSetupWizardOpen);

  const items = useMemo<CommandItem[]>(() => {
    const navItems: CommandItem[] = [
      { id: 'home', label: 'Home', group: 'Navigation', icon: <Home size={16} />, shortcut: '1', action: () => setActiveTab('home') },
      { id: 'agent', label: 'Agent', group: 'Navigation', icon: <MessageCircle size={16} />, shortcut: '2', action: () => setActiveTab('agent') },
      { id: 'project', label: 'Project', group: 'Navigation', icon: <FolderKanban size={16} />, shortcut: '3', action: () => setActiveTab('project') },
      { id: 'files', label: 'Files', group: 'Navigation', icon: <FileCode2 size={16} />, shortcut: '4', action: () => setActiveTab('files') },
      { id: 'sweeps', label: 'Sweeps', group: 'Navigation', icon: <BarChart3 size={16} />, shortcut: '5', action: () => setActiveTab('sweeps') },
    ];

    const domainItems: CommandItem[] = ALL_DOMAIN_IDS.map((id) => ({
      id,
      label: DOMAIN_META[id].label,
      group: 'Domains',
      icon: <span style={{ width: 16, height: 16, display: 'inline-block' }} />,
      action: () => setFocusedDomain(id),
    }));

    const actionItems: CommandItem[] = [
      { id: 'new', label: 'New Project', group: 'Actions', icon: <Plus size={16} />, action: () => setSetupWizardOpen(true) },
      { id: 'reset', label: 'Reset Canvas', group: 'Actions', icon: <RotateCcw size={16} />, action: () => {} },
      { id: 'export', label: 'Export Data', group: 'Actions', icon: <Download size={16} />, action: () => {} },
    ];

    return [...actionItems, ...navItems, ...domainItems];
  }, [setActiveTab, setFocusedDomain, setSetupWizardOpen]);

  const filtered = useMemo(() => {
    if (!query) return items;
    const q = query.toLowerCase();
    return items.filter((item) =>
      item.label.toLowerCase().includes(q) ||
      item.group.toLowerCase().includes(q)
    );
  }, [items, query]);

  const groups = useMemo(() => {
    const map = new Map<string, CommandItem[]>();
    filtered.forEach((item) => {
      const list = map.get(item.group) || [];
      list.push(item);
      map.set(item.group, list);
    });
    return map;
  }, [filtered]);

  // Keyboard handler
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!open) {
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
          e.preventDefault();
          setOpen(true);
        }
        return;
      }

      if (e.key === 'Escape') {
        setOpen(false);
        return;
      }

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        filtered[activeIndex]?.action();
        setOpen(false);
      }
    },
    [open, setOpen, filtered, activeIndex]
  );

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  useEffect(() => {
    if (open) {
      setQuery('');
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [open]);

  if (!open) return null;

  let flatIdx = 0;

  return (
    <>
      <div className="dialog-overlay" onClick={() => setOpen(false)} />
      <div className="dialog-content command-palette">
        <div className="command-palette-input">
          <Search size={16} style={{ color: 'var(--fg-30)', flexShrink: 0 }} />
          <input
            ref={inputRef}
            className="input"
            placeholder="Search commands..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActiveIndex(0);
            }}
          />
        </div>
        <div className="command-palette-results">
          {Array.from(groups.entries()).map(([group, groupItems]) => (
            <div key={group}>
              <div className="command-palette-group">{group}</div>
              {groupItems.map((item) => {
                const idx = flatIdx++;
                return (
                  <button
                    key={item.id}
                    className="command-palette-item"
                    data-active={activeIndex === idx || undefined}
                    onClick={() => {
                      item.action();
                      setOpen(false);
                    }}
                    onMouseEnter={() => setActiveIndex(idx)}
                  >
                    <span className="command-palette-item-icon">{item.icon}</span>
                    <span className="command-palette-item-label">{item.label}</span>
                    {item.shortcut && (
                      <span className="command-palette-item-shortcut">{item.shortcut}</span>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
          {filtered.length === 0 && (
            <div style={{ padding: 24, textAlign: 'center', color: 'var(--fg-30)', fontSize: 13 }}>
              No results found
            </div>
          )}
        </div>
      </div>
    </>
  );
}
