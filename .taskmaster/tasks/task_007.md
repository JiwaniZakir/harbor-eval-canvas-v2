# Task ID: 7

**Title:** Probe Fan-out: 5 Variant Cards with Stagger Animation

**Status:** pending

**Dependencies:** 6

**Priority:** medium

**Description:** The probe fan-out grid shows inside the workspace plate during the probing phase.

Part of workspace-plate.tsx or separate probe-fanout section.

5 Variant Cards:
- Plain, Prior Work, Schema Hint, Audit Trail, Speed Run
- Card: bg-l200, border fg-10, radius-md, 140px min-width
- States: idle (gray border), running (2px accent border pulsing, Loader2 icon), complete (green check, green-50 bg), failed (red X, red-50 bg)
- Stagger entrance: each card delays 80ms (animation-delay: calc(var(--i) * 80ms))

Results Display:
- Failure rate percentage per variant (Departure 600 14px)
- Mean failure rate across all variants
- Verdict: 'promote' (green), 'redesign' (amber), 'reject' (red)
- Verdict text with colored badge

**Details:**

The probe fan-out grid shows inside the workspace plate during the probing phase.

Part of workspace-plate.tsx or separate probe-fanout section.

5 Variant Cards:
- Plain, Prior Work, Schema Hint, Audit Trail, Speed Run
- Card: bg-l200, border fg-10, radius-md, 140px min-width
- States: idle (gray border), running (2px accent border pulsing, Loader2 icon), complete (green check, green-50 bg), failed (red X, red-50 bg)
- Stagger entrance: each card delays 80ms (animation-delay: calc(var(--i) * 80ms))

Results Display:
- Failure rate percentage per variant (Departure 600 14px)
- Mean failure rate across all variants
- Verdict: 'promote' (green), 'redesign' (amber), 'reject' (red)
- Verdict text with colored badge

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 7.1. 5 variant cards with 4 visual states

**Status:** pending  
**Dependencies:** None  

### 7.2. Stagger entrance animation with 80ms delay per card

**Status:** pending  
**Dependencies:** None  

### 7.3. Mean failure rate and verdict display

**Status:** pending  
**Dependencies:** None  

