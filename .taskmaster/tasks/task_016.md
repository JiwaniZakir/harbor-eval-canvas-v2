# Task ID: 16

**Title:** Toast Notification System

**Status:** pending

**Dependencies:** 1, 2

**Priority:** medium

**Description:** Global toast notifications.

File: src/components/layout/toast-stack.tsx

- Fixed bottom-right position (bottom: 24px, right: 24px)
- Stack with 8px gap between toasts
- Toast: bg-l200, radius-md, shadow-outset-050, padding 12px 16px
- Color dot: 6px circle (info=fg-40, success=#16A34A, warning=#D97706, error=#DC2626)
- Message text: Figtree 400 13px fg-70
- Auto-dismiss: 5s default, CSS progress bar countdown at bottom
- Progress bar: 2px height, accent color, width 100% → 0% over duration
- Slide-up entrance (translateY 16px → 0, opacity 0 → 1)
- Slide-right exit
- Max 3 visible at once

Add to UIStore or separate toast store:
- addToast(message, type, duration)
- removeToast(id)

**Details:**

Global toast notifications.

File: src/components/layout/toast-stack.tsx

- Fixed bottom-right position (bottom: 24px, right: 24px)
- Stack with 8px gap between toasts
- Toast: bg-l200, radius-md, shadow-outset-050, padding 12px 16px
- Color dot: 6px circle (info=fg-40, success=#16A34A, warning=#D97706, error=#DC2626)
- Message text: Figtree 400 13px fg-70
- Auto-dismiss: 5s default, CSS progress bar countdown at bottom
- Progress bar: 2px height, accent color, width 100% → 0% over duration
- Slide-up entrance (translateY 16px → 0, opacity 0 → 1)
- Slide-right exit
- Max 3 visible at once

Add to UIStore or separate toast store:
- addToast(message, type, duration)
- removeToast(id)

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 16.1. Toast component with color dots and auto-dismiss

**Status:** pending  
**Dependencies:** None  

### 16.2. Toast stack with slide animations and max 3 limit

**Status:** pending  
**Dependencies:** None  

### 16.3. Toast store/actions integration

**Status:** pending  
**Dependencies:** None  

