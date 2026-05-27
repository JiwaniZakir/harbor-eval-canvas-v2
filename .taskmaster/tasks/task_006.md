# Task ID: 6

**Title:** Workspace Plate: Container + Pipeline Roadmap Strip

**Status:** pending

**Dependencies:** 1, 2, 3, 5

**Priority:** high

**Description:** The workspace plate overlays the canvas when a domain is selected for pipeline work.

File: src/components/canvas/workspace-plate.tsx (~270 lines)

Plate Container:
- 680px max-width, centered in canvas area
- bg-l-neg-50, shadow-inset-200, radius-xl
- Header: accent dot (8px, domain color) + domain name (Figtree 600 16px fg-80) + status badge + X close button
- Status badges with state-specific colors: probing (accent bg), scaffolding (blue bg), validating (purple bg), etc.

Pipeline Roadmap Strip:
- Horizontal strip at bottom of plate
- 5 stages: Intake → Probe → Scaffold → Validate → Publish
- Each stage card: 72px min-width, radius-md, icon + label
- Stage states: locked (fg-10 bg, fg-30 text), available (fg-5 bg, fg-60 text), active (fg-10 bg, fg-80 text, Loader2 rotating), complete (green bg, white check)
- Connector segments: 24px wide, 2px height between cards
- Connector colors: fg-10 for upcoming, fg-30 for passed, accent for active transition

Shows/hides based on UIStore.detailPanel state.
ESC key closes the plate.

**Details:**

The workspace plate overlays the canvas when a domain is selected for pipeline work.

File: src/components/canvas/workspace-plate.tsx (~270 lines)

Plate Container:
- 680px max-width, centered in canvas area
- bg-l-neg-50, shadow-inset-200, radius-xl
- Header: accent dot (8px, domain color) + domain name (Figtree 600 16px fg-80) + status badge + X close button
- Status badges with state-specific colors: probing (accent bg), scaffolding (blue bg), validating (purple bg), etc.

Pipeline Roadmap Strip:
- Horizontal strip at bottom of plate
- 5 stages: Intake → Probe → Scaffold → Validate → Publish
- Each stage card: 72px min-width, radius-md, icon + label
- Stage states: locked (fg-10 bg, fg-30 text), available (fg-5 bg, fg-60 text), active (fg-10 bg, fg-80 text, Loader2 rotating), complete (green bg, white check)
- Connector segments: 24px wide, 2px height between cards
- Connector colors: fg-10 for upcoming, fg-30 for passed, accent for active transition

Shows/hides based on UIStore.detailPanel state.
ESC key closes the plate.

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 6.1. Plate container with header (accent dot, name, status badge, close)

**Status:** pending  
**Dependencies:** None  

### 6.2. Pipeline roadmap strip with 5 stage cards and connectors

**Status:** pending  
**Dependencies:** None  

### 6.3. Stage state rendering (locked/available/active/complete)

**Status:** pending  
**Dependencies:** None  

### 6.4. ESC key handler to close plate

**Status:** pending  
**Dependencies:** None  

