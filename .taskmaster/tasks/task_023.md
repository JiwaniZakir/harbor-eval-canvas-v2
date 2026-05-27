# Task ID: 23

**Title:** Toast Notification System

**Status:** pending

**Dependencies:** 2, 3

**Priority:** medium

**Description:** Global toast notifications.

File: src/components/layout/toast-stack.tsx

- Fixed bottom-right (24px inset)
- Stack with 8px gap, max 3 visible
- Toast: bg-l200, radius-md, shadow-outset-050, padding 12px 16px
- Color dot: 6px circle (info=fg-40, success=#16A34A, warning=#D97706, error=#DC2626)
- Message: Figtree 400 13px fg-70
- Auto-dismiss: 5s default, CSS countdown bar (toast-countdown keyframe)
- Entrance: sd-slideUp from Task 3
- Exit: slide right + fade

Toast state: simple array in a lightweight store or UIStore extension.
API: addToast(message, type?, duration?), removeToast(id)

Uses design tokens for all colors. Uses keyframes from Task 3.

**Details:**

Toast component rendered in layout.tsx (above all content).

The countdown progress bar is 2px height at bottom of toast, using toast-countdown keyframe with linear timing matching the duration.

**Test Strategy:**

1. Toast appears with slide-up animation
2. Auto-dismisses after 5s
3. Color dot matches type
4. Countdown bar animates
5. Max 3 visible, oldest removed first

## Subtasks

### 23.1. Toast component with dot, message, countdown bar

**Status:** pending  
**Dependencies:** None  

### 23.2. Toast stack with max limit and slide animations

**Status:** pending  
**Dependencies:** None  

### 23.3. Toast API (addToast/removeToast)

**Status:** pending  
**Dependencies:** None  

