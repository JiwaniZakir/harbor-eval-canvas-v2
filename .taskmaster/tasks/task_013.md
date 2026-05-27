# Task ID: 13

**Title:** Scaffold Fan-out + Validation Gates

**Status:** pending

**Dependencies:** 4, 11

**Priority:** medium

**Description:** Scaffold agent cards and validation gate cards inside workspace plate.

Scaffold Fan-out (5 cards):
- Agents: Fixtures, Environment, Verifier, Instruction, Contamination
- Same Card primitive as probe variants
- Each shows: agent name, artifact label, generation status
- Stagger entrance animation

Validation Gates (3 cards):
- Oracle Sweep, Nop Sweep, Spoiler Lint
- States: pending (fg-20 dot), running (shimmer animation on border), passed (green Check, green-50 bg), failed (red X, red-50 bg)
- Shimmer uses skeleton-shimmer keyframe on border

**Details:**

These sections show conditionally based on domain status:
- scaffold_queued/scaffolding → scaffold fan-out
- validation_gate → validation gates

Both use the same Card primitive to maintain visual consistency with probe fan-out.

**Test Strategy:**

1. Scaffold cards render when domain is in scaffolding state
2. Validation gates render when domain is in validation state
3. Shimmer animation visible on running gates
4. Pass/fail states show correct colors

## Subtasks

### 13.1. 5 scaffold agent Cards with artifact labels

**Status:** pending  
**Dependencies:** None  

### 13.2. 3 validation gate Cards with 4 states including shimmer

**Status:** pending  
**Dependencies:** None  

### 13.3. Conditional rendering based on domain status

**Status:** pending  
**Dependencies:** None  

