# Task ID: 10

**Title:** Onboarding → Canvas Transition

**Status:** pending

**Dependencies:** 8, 9

**Priority:** medium

**Description:** Smooth animated transition from onboarding wizard completion to the main canvas.

1. User clicks 'Accept & Start Probing'
2. Wizard overlay fades out (300ms opacity 1→0)
3. Canvas fades in (400ms opacity 0→1, 200ms delay)
4. Primary domain node starts pulsing (probe_queued status)
5. Agent tab gets first system message
6. UIStore.globalState → 'canvas_idle'

State updates on completion:
- ProjectStore: project with name, model, workflow description
- DomainStore: all 8 initialized, primary → probe_queued
- UIStore: wizardOpen=false, globalState='canvas_idle'
- AgentStore: add welcome system message

**Details:**

This is a critical UX moment - the transition must feel seamless. The canvas should not flash or jump. Use CSS transitions, not JS animation libraries.

**Test Strategy:**

1. Wizard fades out smoothly
2. Canvas appears with ring visible
3. Primary domain node has pulsing border
4. Agent tab shows welcome message
5. No layout shift during transition

## Subtasks

### 10.1. Wizard fade-out animation

**Status:** pending  
**Dependencies:** None  

### 10.2. Canvas fade-in with staggered delay

**Status:** pending  
**Dependencies:** None  

### 10.3. Store initialization on wizard complete

**Status:** pending  
**Dependencies:** None  

### 10.4. Primary domain pulse activation + welcome message

**Status:** pending  
**Dependencies:** None  

