# Task ID: 21

**Title:** File Upload Component

**Status:** pending

**Dependencies:** 1

**Priority:** low

**Description:** Reusable drag-and-drop file upload zone.

File: src/components/ui/file-upload.tsx

Dropzone:
- Dashed border (2px fg-10), radius-lg, padding 24px
- Upload icon (20px fg-30) + text + hint
- Hover: border fg-20, bg fg-5
- Dragging: border fg-40, bg fg-5, box-shadow
- Accept: .json, .jsonl, .csv, .yaml, .yml, .py, .txt, .md
- Max 50MB per file

Upload List:
- Per-file row: icon + name + size + progress bar + remove button
- Status: uploading (progress bar), complete (green check), error (red bg)
- Progress bar: 60px width, 3px height, fg-40 fill
- Simulated upload progress with intervals

Integration: Used by Files tab and chat composer attach button

**Details:**

Reusable drag-and-drop file upload zone.

File: src/components/ui/file-upload.tsx

Dropzone:
- Dashed border (2px fg-10), radius-lg, padding 24px
- Upload icon (20px fg-30) + text + hint
- Hover: border fg-20, bg fg-5
- Dragging: border fg-40, bg fg-5, box-shadow
- Accept: .json, .jsonl, .csv, .yaml, .yml, .py, .txt, .md
- Max 50MB per file

Upload List:
- Per-file row: icon + name + size + progress bar + remove button
- Status: uploading (progress bar), complete (green check), error (red bg)
- Progress bar: 60px width, 3px height, fg-40 fill
- Simulated upload progress with intervals

Integration: Used by Files tab and chat composer attach button

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 21.1. Dropzone with drag/hover/active visual states

**Status:** pending  
**Dependencies:** None  

### 21.2. Upload item list with progress bars

**Status:** pending  
**Dependencies:** None  

### 21.3. File validation (type, size)

**Status:** pending  
**Dependencies:** None  

