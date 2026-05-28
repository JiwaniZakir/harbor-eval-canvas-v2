'use client';

import { useState, useMemo } from 'react';
import { ChevronRight, Folder, Braces, Code, Settings, FileText, Table } from 'lucide-react';
import { useDomainStore } from '@/lib/stores/domain-store';
import { useUIStore } from '@/lib/stores/ui-store';
import { ALL_DOMAIN_IDS, DOMAIN_META, FILE_TYPE_COLORS } from '@/lib/types';
import type { Artifact } from '@/lib/types';
import { FileUpload } from '@/components/ui/file-upload';
import { formatFileSize } from '@/lib/utils';

const FILE_ICONS: Record<string, { icon: typeof Braces; color: string }> = {
  json: { icon: Braces, color: FILE_TYPE_COLORS.json },
  jsonl: { icon: Braces, color: FILE_TYPE_COLORS.jsonl },
  py: { icon: Code, color: FILE_TYPE_COLORS.py },
  yaml: { icon: Settings, color: FILE_TYPE_COLORS.yaml },
  yml: { icon: Settings, color: FILE_TYPE_COLORS.yml },
  md: { icon: FileText, color: FILE_TYPE_COLORS.md },
  csv: { icon: Table, color: FILE_TYPE_COLORS.csv },
  txt: { icon: FileText, color: FILE_TYPE_COLORS.txt },
};

export function FilesTab() {
  const domainStates = useDomainStore((s) => s.domainStates);
  const focusedDomainId = useUIStore((s) => s.focusedDomainId);
  const [expandedDomains, setExpandedDomains] = useState<Set<string>>(new Set());
  const [selectedFile, setSelectedFile] = useState<Artifact | null>(null);

  // Collect all artifacts grouped by domain
  const fileTree = useMemo(() => {
    return ALL_DOMAIN_IDS
      .filter((id) => domainStates[id].artifacts.length > 0)
      .map((id) => ({
        domainId: id,
        label: DOMAIN_META[id].shortLabel,
        files: domainStates[id].artifacts,
      }));
  }, [domainStates]);

  const toggleDomain = (id: string) => {
    setExpandedDomains((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const isEmpty = fileTree.length === 0;

  return (
    <div>
      {isEmpty ? (
        <div style={{ marginTop: 24 }}>
          <p style={{
            fontFamily: 'var(--font-inter)',
            fontSize: 13,
            color: 'var(--fg-40)',
            textAlign: 'center',
            marginBottom: 16,
          }}>
            No files generated yet. Start probing to generate artifacts.
          </p>
          <FileUpload />
        </div>
      ) : (
        <>
          <div className="file-tree">
            {fileTree.map((group) => {
              const isExpanded = expandedDomains.has(group.domainId);
              return (
                <div key={group.domainId}>
                  <div
                    className="file-tree-item"
                    onClick={() => toggleDomain(group.domainId)}
                  >
                    <ChevronRight
                      className="file-tree-chevron"
                      data-open={isExpanded || undefined}
                    />
                    <Folder className="file-tree-icon" style={{ color: 'var(--fg-40)' }} />
                    <span className="file-tree-name">{group.label}</span>
                    <span className="file-tree-size">{group.files.length} files</span>
                  </div>

                  {isExpanded &&
                    group.files.map((file) => {
                      const fileType = FILE_ICONS[file.type] || FILE_ICONS.txt;
                      const Icon = fileType.icon;
                      return (
                        <div
                          key={file.id}
                          className="file-tree-item"
                          style={{ paddingLeft: 32 }}
                          data-selected={selectedFile?.id === file.id || undefined}
                          onClick={() => setSelectedFile(file)}
                        >
                          <Icon
                            className="file-tree-icon"
                            style={{ color: fileType.color }}
                          />
                          <span className="file-tree-name">{file.name}</span>
                          <span className="file-tree-size">{formatFileSize(file.size)}</span>
                        </div>
                      );
                    })}
                </div>
              );
            })}
          </div>

          {/* File preview */}
          {selectedFile && (
            <div className="file-preview">
              <div className="file-preview-header">
                <span className="file-preview-name">{selectedFile.name}</span>
                <button
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'var(--fg-30)',
                    fontSize: 12,
                  }}
                  onClick={() => setSelectedFile(null)}
                >
                  Close
                </button>
              </div>
              <pre className="file-preview-code">
                {selectedFile.content || `// Content for ${selectedFile.name}\n// File type: ${selectedFile.type}\n// Size: ${formatFileSize(selectedFile.size)}`}
              </pre>
            </div>
          )}

          <div style={{ marginTop: 16 }}>
            <FileUpload />
          </div>
        </>
      )}
    </div>
  );
}
