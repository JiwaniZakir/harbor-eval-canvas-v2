'use client';

import { useState } from 'react';
import { Star, Plus } from 'lucide-react';
import { useProjectStore } from '@/lib/stores/project-store';
import { useDomainStore } from '@/lib/stores/domain-store';
import { PROVIDER_COLORS } from '@/lib/types';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import type { Provider } from '@/lib/types';

export function ProjectTab() {
  const project = useProjectStore((s) => s.project);
  const resetProject = useProjectStore((s) => s.resetProject);
  const resetDomains = useDomainStore((s) => s.resetDomains);
  const [confirmDialog, setConfirmDialog] = useState<'reset' | 'delete' | null>(null);

  const handleReset = () => {
    resetProject();
    resetDomains();
    setConfirmDialog(null);
  };

  const handleDelete = () => {
    resetProject();
    resetDomains();
    localStorage.removeItem('harbor-project');
    localStorage.removeItem('harbor-domains');
    setConfirmDialog(null);
  };

  return (
    <div>
      <div className="project-section-header">Project Details</div>
      <div className="project-row">
        <span className="project-row-label">Name</span>
        <span className="project-row-value">{project?.name || '---'}</span>
      </div>
      <div className="project-row">
        <span className="project-row-label">Created</span>
        <span className="project-row-value">
          {project?.createdAt
            ? new Date(project.createdAt).toLocaleDateString()
            : '---'}
        </span>
      </div>
      <div className="project-row">
        <span className="project-row-label">Progress</span>
        <span className="project-row-value">{project?.globalProgress ?? 0}%</span>
      </div>

      <div className="project-section-header">Target Model</div>
      <div className="project-model-chips">
        {project?.targetModel && (
          <Badge variant="accent">
            <Star size={10} />
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: PROVIDER_COLORS[project.targetModel.provider] || 'var(--fg-40)',
                display: 'inline-block',
              }}
            />
            {project.targetModel.modelName}
          </Badge>
        )}
        <Badge variant="default" interactive onClick={() => {}}>
          <Plus size={10} />
          Add model
        </Badge>
      </div>

      {project?.workflowDescription && (
        <>
          <div className="project-section-header">Workflow</div>
          <p style={{ fontFamily: 'var(--font-inter)', fontSize: 13, color: 'var(--fg-60)', lineHeight: 1.5 }}>
            {project.workflowDescription}
          </p>
        </>
      )}

      <div className="project-section-header">Danger Zone</div>
      <button className="project-danger-link" onClick={() => setConfirmDialog('reset')}>
        Reset Project
      </button>
      <button className="project-danger-link" onClick={() => setConfirmDialog('delete')}>
        Delete All Data
      </button>

      <Dialog
        open={confirmDialog === 'reset'}
        onClose={() => setConfirmDialog(null)}
        title="Reset Project?"
        description="This will reset all domain states and progress. Your project settings will be preserved."
      >
        <div className="dialog-actions">
          <Button variant="secondary" size="md" onClick={() => setConfirmDialog(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={handleReset}>
            Reset
          </Button>
        </div>
      </Dialog>

      <Dialog
        open={confirmDialog === 'delete'}
        onClose={() => setConfirmDialog(null)}
        title="Delete All Data?"
        description="This will permanently delete your project, all domain states, and all generated artifacts. This cannot be undone."
      >
        <div className="dialog-actions">
          <Button variant="secondary" size="md" onClick={() => setConfirmDialog(null)}>
            Cancel
          </Button>
          <Button variant="danger" size="md" onClick={handleDelete}>
            Delete Everything
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
