# Task ID: 27

**Title:** Error State Components

**Status:** pending

**Dependencies:** 2, 4

**Priority:** low

**Description:** 3 error display variants for different contexts.

File: src/components/ui/error-states.tsx

1. ErrorState (full-area): Icon circle (48px, red-50 bg, red icon) + title (Figtree 500 16px) + description (Figtree 400 13px fg-40) + retry Button (secondary).
   5 kinds: network (WifiOff), auth (Ban), rate-limit, server, generic (AlertTriangle).

2. ErrorBanner (inline): Red-50 bg, red-200 border, AlertTriangle + message + dismiss Button (ghost).

3. ChatError (chat bubble): Red-50 bg, radius-md, 12px text + 'Retry' link.

All use Button primitive for actions. All use design token colors.

**Details:**

These are used as fallbacks throughout the app:
- ErrorState: canvas area when API fails
- ErrorBanner: inside panel sections
- ChatError: inline in agent message list

**Test Strategy:**

1. Each variant renders with correct styling
2. Retry button fires callback
3. Dismiss button hides banner
4. All colors use design tokens

## Subtasks

### 27.1. ErrorState with 5 kinds and retry Button

**Status:** pending  
**Dependencies:** None  

### 27.2. ErrorBanner with dismiss

**Status:** pending  
**Dependencies:** None  

### 27.3. ChatError with retry link

**Status:** pending  
**Dependencies:** None  

