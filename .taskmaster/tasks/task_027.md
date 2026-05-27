# Task ID: 27

**Title:** Onboarding → Canvas Transition

**Status:** pending

**Dependencies:** 4, 5

**Priority:** medium

**Description:** Smooth transition from onboarding completion to the main canvas.

Flow:
1. User clicks 'Accept & Start Probing' on Step 5
2. SetupWizard closes with fade-out (300ms)
3. Canvas fades in with radial ring
4. Primary domain node pulses (probing state)
5. GlobalState transitions: onboarding → canvas_idle
6. Agent tab receives first message from system

Animation:
- Wizard overlay: opacity 1 → 0, 300ms
- Canvas: opacity 0 → 1, 400ms, with 200ms delay
- Primary domain node: starts pulsing after canvas visible

State updates:
- ProjectStore: set project with name, model, workflow
- DomainStore: initialize all 8 domains, set primary to probe_queued
- UIStore: close wizard, set globalState to canvas_idle

**Details:**

Smooth transition from onboarding completion to the main canvas.

Flow:
1. User clicks 'Accept & Start Probing' on Step 5
2. SetupWizard closes with fade-out (300ms)
3. Canvas fades in with radial ring
4. Primary domain node pulses (probing state)
5. GlobalState transitions: onboarding → canvas_idle
6. Agent tab receives first message from system

Animation:
- Wizard overlay: opacity 1 → 0, 300ms
- Canvas: opacity 0 → 1, 400ms, with 200ms delay
- Primary domain node: starts pulsing after canvas visible

State updates:
- ProjectStore: set project with name, model, workflow
- DomainStore: initialize all 8 domains, set primary to probe_queued
- UIStore: close wizard, set globalState to canvas_idle

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 27.1. Wizard fade-out animation

**Status:** pending  
**Dependencies:** None  

### 27.2. Canvas fade-in with delay

**Status:** pending  
**Dependencies:** None  

### 27.3. State store initialization on wizard complete

**Status:** pending  
**Dependencies:** None  

### 27.4. Primary domain pulse activation

**Status:** pending  
**Dependencies:** None  

