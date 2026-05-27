'use client';

import { useState, useRef, useCallback, type DragEvent, type ChangeEvent } from 'react';
import { Upload, X, Check, AlertTriangle } from 'lucide-react';
import { formatFileSize } from '@/lib/utils';

const ACCEPTED_TYPES = ['.json', '.jsonl', '.csv', '.yaml', '.yml', '.py', '.txt', '.md'];
const MAX_SIZE_MB = 50;
const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;

interface UploadFile {
  id: string;
  file: File;
  progress: number;
  status: 'uploading' | 'complete' | 'error';
  error?: string;
}

interface FileUploadProps {
  onFilesAdded?: (files: File[]) => void;
  accept?: string[];
  maxSizeMB?: number;
}

export function FileUpload({
  onFilesAdded,
  accept = ACCEPTED_TYPES,
  maxSizeMB = MAX_SIZE_MB,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadFile[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      const ext = '.' + file.name.split('.').pop()?.toLowerCase();
      if (!accept.includes(ext)) {
        return `Unsupported file type: ${ext}`;
      }
      if (file.size > maxSizeMB * 1024 * 1024) {
        return `File too large (max ${maxSizeMB}MB)`;
      }
      return null;
    },
    [accept, maxSizeMB]
  );

  const simulateUpload = useCallback((uploadFile: UploadFile) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30 + 10;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: 100, status: 'complete' } : f
          )
        );
      } else {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === uploadFile.id ? { ...f, progress: Math.min(progress, 99) } : f
          )
        );
      }
    }, 200);
  }, []);

  const handleFiles = useCallback(
    (fileList: FileList | File[]) => {
      const newFiles: UploadFile[] = [];
      const validFiles: File[] = [];

      Array.from(fileList).forEach((file) => {
        const error = validateFile(file);
        const uploadFile: UploadFile = {
          id: Math.random().toString(36).substring(2, 11),
          file,
          progress: error ? 0 : 0,
          status: error ? 'error' : 'uploading',
          error: error || undefined,
        };
        newFiles.push(uploadFile);
        if (!error) {
          validFiles.push(file);
          simulateUpload(uploadFile);
        }
      });

      setFiles((prev) => [...prev, ...newFiles]);
      if (validFiles.length > 0) {
        onFilesAdded?.(validFiles);
      }
    },
    [validateFile, simulateUpload, onFilesAdded]
  );

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      handleFiles(e.dataTransfer.files);
    },
    [handleFiles]
  );

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) handleFiles(e.target.files);
    },
    [handleFiles]
  );

  const removeFile = useCallback((id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
  }, []);

  return (
    <div>
      <div
        className="file-upload-zone"
        data-dragging={isDragging || undefined}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <Upload className="file-upload-icon" />
        <p className="file-upload-text">Drop files here or browse</p>
        <p className="file-upload-hint">
          {accept.join(', ')} up to {maxSizeMB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={accept.join(',')}
          onChange={handleChange}
          style={{ display: 'none' }}
        />
      </div>

      {files.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {files.map((f) => (
            <div key={f.id} className="file-upload-item">
              {f.status === 'complete' ? (
                <Check size={14} style={{ color: 'var(--status-success)' }} />
              ) : f.status === 'error' ? (
                <AlertTriangle size={14} style={{ color: 'var(--status-error)' }} />
              ) : null}
              <span className="file-upload-item-name">{f.file.name}</span>
              <span className="file-upload-item-size">{formatFileSize(f.file.size)}</span>
              {f.status === 'uploading' && (
                <div className="file-upload-progress">
                  <div
                    className="file-upload-progress-fill"
                    style={{ width: `${f.progress}%` }}
                  />
                </div>
              )}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(f.id);
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--fg-30)',
                  padding: 2,
                }}
              >
                <X size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
