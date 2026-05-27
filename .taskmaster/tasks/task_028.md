# Task ID: 28

**Title:** Keyboard Shortcuts: Tab Switch + Escape Cascade + Enter Context

**Status:** pending

**Dependencies:** 7, 5, 25

**Priority:** low

**Description:** Global keyboard shortcut handling.

Implement in top-bar.tsx or dedicated useKeyboardShortcuts hook:

- 1-5: Switch to tab (Home, Agent, Project, Files, Sweeps)
- ESC: Close in priority order: command palette → workspace plate → modal/dialog → dropdown
- Enter: Submit onboarding input / Send chat message (when focused)
- Cmd+K: Command palette (handled by Task 25)
- Cmd+/: Focus chat composer

Guard: Don't fire number keys when typing in input/textarea.

Accessibility: Add aria-keyshortcuts attributes to targets.

**Details:**

Escape cascade is important: ESC should close the MOST RECENT thing opened, not everything at once. Check UIStore state in order: commandPaletteOpen → focusedDomainId (plate) → any open dialog → any open dropdown.

**Test Strategy:**

1. Press 1 → Home tab active
2. Press 3 → Project tab active
3. ESC closes workspace plate when open
4. ESC closes command palette when open
5. Number keys don't fire when typing in input
6. Cmd+/ focuses chat composer

## Subtasks

### 28.1. Number key (1-5) tab switching with input guard

**Status:** pending  
**Dependencies:** None  

### 28.2. Escape cascade (palette → plate → dialog → dropdown)

**Status:** pending  
**Dependencies:** None  

### 28.3. Enter context handling

**Status:** pending  
**Dependencies:** None  

### 28.4. Cmd+/ focus chat composer

**Status:** pending  
**Dependencies:** None  

