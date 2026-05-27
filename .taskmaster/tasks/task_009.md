# Task ID: 9

**Title:** Validation Gates: 3 Gate Cards (Oracle, Nop, Spoiler)

**Status:** pending

**Dependencies:** 6

**Priority:** medium

**Description:** Validation gate section in workspace plate.

3 Gate Cards:
- Oracle Sweep, Nop Sweep, Spoiler Lint
- States: pending (fg-20 dot), running (shimmer animation on border), passed (green check + green-50 bg), failed (red X + red-50 bg)
- Shimmer: 1.5s linear gradient sweep on running state
- Gate results shown inline with pass/fail summary

**Details:**

Validation gate section in workspace plate.

3 Gate Cards:
- Oracle Sweep, Nop Sweep, Spoiler Lint
- States: pending (fg-20 dot), running (shimmer animation on border), passed (green check + green-50 bg), failed (red X + red-50 bg)
- Shimmer: 1.5s linear gradient sweep on running state
- Gate results shown inline with pass/fail summary

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 9.1. 3 validation gate cards with 4 states

**Status:** pending  
**Dependencies:** None  

### 9.2. Shimmer animation for running state

**Status:** pending  
**Dependencies:** None  

