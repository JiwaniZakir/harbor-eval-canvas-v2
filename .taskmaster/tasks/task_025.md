# Task ID: 25

**Title:** Command Palette (Cmd+K)

**Status:** pending

**Dependencies:** 4, 5, 7

**Priority:** low

**Description:** Global command palette for quick navigation.

File: src/components/studio/command-palette-modal.tsx

Trigger: Cmd+K / Ctrl+K

Dialog (uses Dialog primitive base):
- 480px width, centered
- Search Input (uses Input primitive, full width, 44px)
- Search icon (Lucide Search, 16px)

Results:
- Grouped: 'Actions' section + 'Navigation' section
- Item: 36px, icon 16px + label (Figtree 400 13px fg-70) + shortcut (Departure 11px fg-30)
- Keyboard nav: ↑↓ move selection, Enter activates, ESC closes
- Active: bg fg-5, fg-80 text

Actions: New Project, Reset Canvas, Export Data
Navigation: Home, Agent, Project, Files, Sweeps + 8 domain names

Uses Dialog and Input primitives for visual consistency.

**Details:**

The command palette is a power-user feature. It must feel snappy - results filter instantly on keystroke.

Implement with useEffect keydown listener for Cmd+K. UIStore.commandPaletteOpen drives visibility.

**Test Strategy:**

1. Cmd+K opens palette
2. Typing filters results
3. Arrow keys navigate, Enter activates
4. ESC closes
5. Selecting 'Home' switches to home tab

## Subtasks

### 25.1. Cmd+K listener and Dialog rendering

**Status:** pending  
**Dependencies:** None  

### 25.2. Search Input with instant filtering

**Status:** pending  
**Dependencies:** None  

### 25.3. Grouped results with keyboard navigation

**Status:** pending  
**Dependencies:** None  

### 25.4. Action handlers (navigate, create, reset)

**Status:** pending  
**Dependencies:** None  

