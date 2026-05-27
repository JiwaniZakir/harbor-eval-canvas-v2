# Task ID: 19

**Title:** Files Tab: File Tree + Editor Preview + Upload Zone

**Status:** pending

**Dependencies:** 4, 5, 7, 22

**Priority:** medium

**Description:** Files tab showing generated artifacts.

File: src/components/panel/files-tab.tsx

File Tree:
- Recursive builder from DomainStore artifacts
- Folder: ChevronRight (rotates 90° on expand) + folder icon + name
- File: type-specific icon with color + name + size
- Indent: 16px per depth level
- Click: opens inline preview
- Item: 32px height, hover bg fg-5, radius-sm

File Type Icons (Lucide):
- .json/.jsonl: Braces, blue
- .py: Code, green
- .yaml/.yml: Settings, purple
- .md: FileText, gray
- .csv: Table, amber

Inline Preview:
- Code view: monospace, line numbers
- Toggle: Code/Preview tabs (uses same tab pattern as panel)
- File header with filename + close button

Upload Zone (uses File Upload component from Task 22):
- Drag-drop area at bottom of tree
- Only shown when tree is non-empty or as empty state

**Details:**

The file tree is purely client-side. Artifacts are stored in DomainStore as file metadata objects.

In MVP, file content is mock/placeholder. The upload zone stores files in-memory only.

**Test Strategy:**

1. File tree renders with correct icons and indentation
2. Folders expand/collapse with chevron animation
3. File click shows inline preview
4. Upload zone accepts drag-drop
5. File type icons match file extension

## Subtasks

### 19.1. Recursive file tree with expand/collapse

**Status:** pending  
**Dependencies:** None  

### 19.2. File type icons with extension-based colors

**Status:** pending  
**Dependencies:** None  

### 19.3. Inline editor preview with code/preview toggle

**Status:** pending  
**Dependencies:** None  

### 19.4. Integration with upload zone component

**Status:** pending  
**Dependencies:** None  

