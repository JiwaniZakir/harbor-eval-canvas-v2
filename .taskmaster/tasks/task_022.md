# Task ID: 22

**Title:** File Upload Component

**Status:** pending

**Dependencies:** 2, 4

**Priority:** low

**Description:** Reusable drag-and-drop file upload zone.

File: src/components/ui/file-upload.tsx

Dropzone:
- Dashed border (2px fg-10), radius-lg, padding 24px
- Upload icon (20px fg-30) + 'Drop files here or browse' + hint text
- Hover: border fg-20, bg fg-5
- Dragging: border fg-40, bg fg-5, box-shadow ring
- Accept: .json, .jsonl, .csv, .yaml, .yml, .py, .txt, .md
- Max 50MB per file

Upload Item List:
- Per-file row: icon + name + size + progress bar + remove button
- Progress bar: 60px × 3px, fg-40 fill
- States: uploading (progress), complete (green Check), error (red bg)

Uses design tokens throughout. No hardcoded colors.

**Details:**

This component is used by the Files tab (Task 19) and could be used by the chat composer attach button.

File validation: check extension against accept list, check size against maxSizeMB.

Upload is simulated in MVP (no backend). Progress uses setInterval with random increments.

**Test Strategy:**

1. Drag-drop zone highlights on drag over
2. Files appear in list after drop
3. Progress bar animates
4. Remove button removes file from list
5. Oversized files show error state

## Subtasks

### 22.1. Dropzone with drag/hover/active states

**Status:** pending  
**Dependencies:** None  

### 22.2. Upload item list with progress bars

**Status:** pending  
**Dependencies:** None  

### 22.3. File validation (type + size)

**Status:** pending  
**Dependencies:** None  

