# Task ID: 30

**Title:** Global Error Boundary + Loading States

**Status:** pending

**Dependencies:** 4, 27

**Priority:** medium

**Description:** React error boundary and global loading handling.

File: src/components/layout/error-boundary.tsx
- Catches unhandled React errors
- Renders ErrorState (from Task 27) with retry button
- Retry resets error state and re-renders children

File: src/app/loading.tsx
- Next.js loading state file
- Shows centered Spinner from UI primitives

File: src/app/error.tsx
- Next.js error boundary file
- Shows ErrorState with 'Try again' button

**Details:**

These catch-all components prevent the app from showing a white screen on errors. They use the same design language as the rest of the app (ErrorState from Task 27, Spinner from Task 4).

**Test Strategy:**

1. Throwing error in a component shows ErrorState
2. Retry button recovers from error
3. Loading state shows Spinner
4. Error boundary doesn't break on nested errors

## Subtasks

### 30.1. React error boundary component with ErrorState fallback

**Status:** pending  
**Dependencies:** None  

### 30.2. Next.js loading.tsx with Spinner

**Status:** pending  
**Dependencies:** None  

### 30.3. Next.js error.tsx with ErrorState + retry

**Status:** pending  
**Dependencies:** None  

