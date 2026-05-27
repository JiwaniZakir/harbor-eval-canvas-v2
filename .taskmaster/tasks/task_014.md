# Task ID: 14

**Title:** Domain Click → Workspace Plate Transition

**Status:** pending

**Dependencies:** 9, 11, 12, 13

**Priority:** medium

**Description:** Wire domain node clicks to open the workspace plate with correct content.

1. User clicks domain node on radial ring
2. UIStore.focusedDomainId set to domain
3. Workspace plate slides in (sd-slideUp)
4. Fan-out content rendered based on status:
   - untested/probe_queued/probing/probe_complete → probe fan-out
   - scaffold_queued/scaffolding/scaffold_complete → scaffold fan-out
   - validation_gate/gate_passed/gate_failed → validation gates
   - target_sweep/sweep_complete → sweep results
   - published → published summary
5. Pipeline roadmap highlights current stage
6. Clicking different domain: content cross-fades
7. ESC or X: plate closes, focusedDomainId → null
8. Ring nodes dim except active one

**Details:**

The workspace plate is the primary work surface. Its content is entirely driven by DomainStore state.

Cross-fade between domains: 200ms opacity transition on content area.

**Test Strategy:**

1. Click domain → plate opens with correct fan-out
2. Click different domain → content changes without plate closing
3. ESC closes plate and clears focusedDomainId
4. Ring nodes dim correctly
5. Pipeline roadmap highlights correct stage

## Subtasks

### 14.1. Domain click → workspace open with slide animation

**Status:** pending  
**Dependencies:** None  

### 14.2. Content routing switch based on domain status

**Status:** pending  
**Dependencies:** None  

### 14.3. Cross-fade on domain switch

**Status:** pending  
**Dependencies:** None  

### 14.4. Close on ESC/X with ring restore

**Status:** pending  
**Dependencies:** None  

