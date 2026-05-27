# Task ID: 13

**Title:** Files Tab: File Tree + Inline Editor + Upload Zone

**Status:** pending

**Dependencies:** 2, 3

**Priority:** medium

**Description:** Files tab showing generated artifacts.

File: src/components/panel/files-tab.tsx

File Tree:
- Recursive tree builder from artifacts list
- Folder: ChevronRight icon (rotates 90° on expand), folder icon, name
- File: type-specific icon with domain color, name, size
- Indent: 16px per level
- Click file: opens inline preview
- Tree item: 32px height, hover bg fg-5, radius-sm

File Type Icons:
- .json/.jsonl: braces icon, blue
- .py: code icon, green
- .yaml/.yml: config icon, purple
- .md: text icon, gray
- .csv: table icon, amber

Inline Editor Preview:
- Code view: monospace font, line numbers, syntax-highlighted bg
- Preview toggle: Code/Preview tabs
- File header with filename and close button

Upload Zone:
- Drag-and-drop area with dashed border
- Accept: .json, .jsonl, .csv, .yaml, .yml, .py, .txt, .md
- Max 50MB per file
- Progress bars during upload
- File list with remove buttons

**Details:**

Files tab showing generated artifacts.

File: src/components/panel/files-tab.tsx

File Tree:
- Recursive tree builder from artifacts list
- Folder: ChevronRight icon (rotates 90° on expand), folder icon, name
- File: type-specific icon with domain color, name, size
- Indent: 16px per level
- Click file: opens inline preview
- Tree item: 32px height, hover bg fg-5, radius-sm

File Type Icons:
- .json/.jsonl: braces icon, blue
- .py: code icon, green
- .yaml/.yml: config icon, purple
- .md: text icon, gray
- .csv: table icon, amber

Inline Editor Preview:
- Code view: monospace font, line numbers, syntax-highlighted bg
- Preview toggle: Code/Preview tabs
- File header with filename and close button

Upload Zone:
- Drag-and-drop area with dashed border
- Accept: .json, .jsonl, .csv, .yaml, .yml, .py, .txt, .md
- Max 50MB per file
- Progress bars during upload
- File list with remove buttons

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 13.1. Recursive file tree with expand/collapse

**Status:** pending  
**Dependencies:** None  

### 13.2. File type icons with domain colors

**Status:** pending  
**Dependencies:** None  

### 13.3. Inline editor preview with code/preview toggle

**Status:** pending  
**Dependencies:** None  

### 13.4. Drag-and-drop upload zone with progress bars

**Status:** pending  
**Dependencies:** None  

