# Task ID: 24

**Title:** Keyboard Shortcuts: Tab Switch + Escape + Enter

**Status:** pending

**Dependencies:** 2, 3, 18

**Priority:** low

**Description:** Global keyboard shortcut handling.

Implement in top-bar.tsx or dedicated hook:

- Keys 1-5: Switch to tab (Home, Agent, Project, Files, Sweeps)
- Escape: Close workspace plate → close modal → close dropdown (priority order)
- Enter: Submit in onboarding input / Send in chat composer (when focused)
- Cmd+K / Ctrl+K: Open command palette
- Cmd+/ / Ctrl+/: Focus chat composer

Guard: Don't fire when typing in input/textarea (except Enter for send)
Accessibility: All shortcuts should have ARIA labels on their targets

**Details:**

Global keyboard shortcut handling.

Implement in top-bar.tsx or dedicated hook:

- Keys 1-5: Switch to tab (Home, Agent, Project, Files, Sweeps)
- Escape: Close workspace plate → close modal → close dropdown (priority order)
- Enter: Submit in onboarding input / Send in chat composer (when focused)
- Cmd+K / Ctrl+K: Open command palette
- Cmd+/ / Ctrl+/: Focus chat composer

Guard: Don't fire when typing in input/textarea (except Enter for send)
Accessibility: All shortcuts should have ARIA labels on their targets

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 24.1. Number key (1-5) tab switching with input guard

**Status:** pending  
**Dependencies:** None  

### 24.2. Escape key cascade (plate → modal → dropdown)

**Status:** pending  
**Dependencies:** None  

### 24.3. Enter key context (onboarding submit / chat send)

**Status:** pending  
**Dependencies:** None  

### 24.4. Cmd+K and Cmd+/ shortcuts

**Status:** pending  
**Dependencies:** None  

