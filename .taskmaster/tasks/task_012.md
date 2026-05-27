# Task ID: 12

**Title:** Probe Fan-out: 5 Variant Cards

**Status:** pending

**Dependencies:** 4, 11

**Priority:** medium

**Description:** Grid of 5 probe variant cards inside the workspace plate.

Variants: Plain, Prior Work, Schema Hint, Audit Trail, Speed Run

Each card uses the Card primitive (interactive variant) with additions:
- Idle: default Card border
- Running: 2px accent border + pulseGlow animation, Spinner icon
- Complete: green-50 bg, green Check icon, failure rate (Departure 600 14px)
- Failed: red-50 bg, X icon

Stagger entrance: each card delays 80ms (CSS animation-delay: calc(var(--i) * 80ms))

Below cards:
- Mean failure rate (Departure 600 16px)
- Verdict Badge: 'promote' (success), 'redesign' (warning), 'reject' (error)

**Details:**

Cards are rendered in a CSS grid (repeat(auto-fill, minmax(140px, 1fr))).

The stagger entrance uses the fanout-entrance keyframe from Task 3.

Variant data comes from DomainStore.domainStates[focusedDomainId].probeSummary.variants

**Test Strategy:**

1. 5 cards render in grid
2. Stagger animation visible (each card appears 80ms after previous)
3. Running state shows pulsing border + spinner
4. Complete state shows green with percentage
5. Verdict badge shows correct color

## Subtasks

### 12.1. 5 variant Cards with 4 visual states

**Status:** pending  
**Dependencies:** None  

### 12.2. Stagger entrance animation with CSS delay

**Status:** pending  
**Dependencies:** None  

### 12.3. Mean failure rate + verdict Badge display

**Status:** pending  
**Dependencies:** None  

