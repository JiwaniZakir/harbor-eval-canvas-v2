# Task ID: 18

**Title:** Command Palette (Cmd+K)

**Status:** pending

**Dependencies:** 1, 2, 3

**Priority:** low

**Description:** Global command palette for quick navigation and actions.

File: src/components/studio/command-palette-modal.tsx

Trigger: Cmd+K (Mac) / Ctrl+K (Windows)

Dialog:
- 480px width, centered, bg-l200, radius-lg, shadow-outset-150
- Backdrop: bg-fg-100 at 20% opacity, blur(4px)
- Search input: full width, 44px, Search icon 16px, Figtree 400 14px
- Auto-focus on open

Results:
- Grouped: Actions section + Navigation section
- Item: 36px height, icon 16px + label (Figtree 400 13px fg-70) + shortcut hint (Departure 11px fg-30)
- Keyboard nav: arrow keys move selection, Enter activates, Escape closes
- Active item: bg fg-5, fg-80 text
- Max 8 visible results, scrollable

Actions: New Project, Reset Canvas, Export Data
Navigation: Home, Agent, Project, Files, Sweeps + each domain name

**Details:**

Global command palette for quick navigation and actions.

File: src/components/studio/command-palette-modal.tsx

Trigger: Cmd+K (Mac) / Ctrl+K (Windows)

Dialog:
- 480px width, centered, bg-l200, radius-lg, shadow-outset-150
- Backdrop: bg-fg-100 at 20% opacity, blur(4px)
- Search input: full width, 44px, Search icon 16px, Figtree 400 14px
- Auto-focus on open

Results:
- Grouped: Actions section + Navigation section
- Item: 36px height, icon 16px + label (Figtree 400 13px fg-70) + shortcut hint (Departure 11px fg-30)
- Keyboard nav: arrow keys move selection, Enter activates, Escape closes
- Active item: bg fg-5, fg-80 text
- Max 8 visible results, scrollable

Actions: New Project, Reset Canvas, Export Data
Navigation: Home, Agent, Project, Files, Sweeps + each domain name

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 18.1. Cmd+K listener and dialog rendering

**Status:** pending  
**Dependencies:** None  

### 18.2. Search input with filtering

**Status:** pending  
**Dependencies:** None  

### 18.3. Grouped results with keyboard navigation

**Status:** pending  
**Dependencies:** None  

### 18.4. Action execution (navigate, create, reset)

**Status:** pending  
**Dependencies:** None  

