'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronDown, ChevronRight, Settings, Plus, LogOut } from 'lucide-react';
import { useProjectStore } from '@/lib/stores/project-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { DOMAIN_META, PROVIDER_COLORS } from '@/lib/types';
import { createClient } from '@/lib/supabase/client';

export function TopBar() {
  const router = useRouter();
  const project = useProjectStore((s) => s.project);
  const focusedDomainId = useUIStore((s) => s.focusedDomainId);
  const dropdownOpen = useUIStore((s) => s.projectDropdownOpen);
  const setDropdownOpen = useUIStore((s) => s.setProjectDropdownOpen);
  const setSetupWizardOpen = useUIStore((s) => s.setSetupWizardOpen);
  const [signingOut, setSigningOut] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  async function handleSignOut() {
    setSigningOut(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    setDropdownOpen(false);
    router.replace('/login');
    router.refresh();
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

        <button className="topbar-settings" aria-label="Settings">
          <Settings size={18} />
        </button>
      </div>
    </header>
  );
}
