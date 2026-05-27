# Task ID: 28

**Title:** Domain Node → Workspace Plate Transition

**Status:** pending

**Dependencies:** 5, 6, 7, 8, 9

**Priority:** medium

**Description:** Clicking a domain node opens the workspace plate with fan-out.

Flow:
1. User clicks domain node on ring
2. UIStore.focusedDomainId set
3. Workspace plate slides in (sd-slideUp animation)
4. Fan-out cards stagger in (80ms delay each)
5. Pipeline roadmap updates to show current stage
6. Clicking different domain: plate content cross-fades
7. ESC or X: plate slides out, focusedDomainId clears

Fan-out content depends on domain status:
- probe_queued/probing → show probe fan-out
- scaffold_queued/scaffolding → show scaffold fan-out
- validation_gate → show validation gates
- target_sweep → show sweep results
- published → show published summary

**Details:**

Clicking a domain node opens the workspace plate with fan-out.

Flow:
1. User clicks domain node on ring
2. UIStore.focusedDomainId set
3. Workspace plate slides in (sd-slideUp animation)
4. Fan-out cards stagger in (80ms delay each)
5. Pipeline roadmap updates to show current stage
6. Clicking different domain: plate content cross-fades
7. ESC or X: plate slides out, focusedDomainId clears

Fan-out content depends on domain status:
- probe_queued/probing → show probe fan-out
- scaffold_queued/scaffolding → show scaffold fan-out
- validation_gate → show validation gates
- target_sweep → show sweep results
- published → show published summary

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 28.1. Domain click → workspace plate open with animation

**Status:** pending  
**Dependencies:** None  

### 28.2. Fan-out content routing based on domain status

**Status:** pending  
**Dependencies:** None  

### 28.3. Cross-fade when switching domains

**Status:** pending  
**Dependencies:** None  

### 28.4. Close plate on ESC/X with animation

**Status:** pending  
**Dependencies:** None  

