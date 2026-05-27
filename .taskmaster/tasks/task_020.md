# Task ID: 20

**Title:** Error State Components

**Status:** pending

**Dependencies:** 1

**Priority:** low

**Description:** Contextual error displays for different failure scenarios.

File: src/components/ui/error-states.tsx

3 Error Variants:

1. ErrorState (full-area):
- Centered flex column, padding 48px 24px
- Icon circle: 48px, rounded-full, red-50 bg, red icon
- Title: Figtree 500 16px fg-80
- Description: Figtree 400 13px fg-40, max-width 280px
- Retry button: inline-flex, gap 6px, border fg-10, bg-l200, Figtree 500 13px fg-60
- 5 error kinds: network (WifiOff), auth (Ban), rate-limit (AlertTriangle), server, generic

2. ErrorBanner (inline):
- Flex row, padding 10px 14px, red-50 bg, red-200 border
- AlertTriangle icon + message text (Figtree 400 13px, red-800) + dismiss button

3. ChatError (chat bubble):
- Inline in message list
- Red-50 bg, red-200 border, radius-md
- AlertTriangle 12px + message + 'Retry' underlined link

**Details:**

Contextual error displays for different failure scenarios.

File: src/components/ui/error-states.tsx

3 Error Variants:

1. ErrorState (full-area):
- Centered flex column, padding 48px 24px
- Icon circle: 48px, rounded-full, red-50 bg, red icon
- Title: Figtree 500 16px fg-80
- Description: Figtree 400 13px fg-40, max-width 280px
- Retry button: inline-flex, gap 6px, border fg-10, bg-l200, Figtree 500 13px fg-60
- 5 error kinds: network (WifiOff), auth (Ban), rate-limit (AlertTriangle), server, generic

2. ErrorBanner (inline):
- Flex row, padding 10px 14px, red-50 bg, red-200 border
- AlertTriangle icon + message text (Figtree 400 13px, red-800) + dismiss button

3. ChatError (chat bubble):
- Inline in message list
- Red-50 bg, red-200 border, radius-md
- AlertTriangle 12px + message + 'Retry' underlined link

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 20.1. ErrorState with 5 error kinds and retry button

**Status:** pending  
**Dependencies:** None  

### 20.2. ErrorBanner inline with dismiss

**Status:** pending  
**Dependencies:** None  

### 20.3. ChatError bubble with retry link

**Status:** pending  
**Dependencies:** None  

