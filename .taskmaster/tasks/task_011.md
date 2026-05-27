# Task ID: 11

**Title:** Workspace Plate: Container + Pipeline Roadmap Strip

**Status:** pending

**Dependencies:** 4, 5, 6, 9

**Priority:** high

**Description:** Overlay plate that opens when a domain is clicked, showing the pipeline workflow.

File: src/components/canvas/workspace-plate.tsx (~270 lines)

Plate Container:
- 680px max-width, centered, bg-l-neg-50, shadow-inset-200, radius-xl
- Header: accent dot (8px) + domain name (Figtree 600 16px fg-80) + status Badge + X close button
- Status badges use the Badge primitive with state-specific variants

Pipeline Roadmap Strip:
- 5 stages: Intake → Probe → Scaffold → Validate → Publish
- Each: 72px Card with icon (from SVG assets) + label
- States: locked (fg-10 bg, fg-30), available (fg-5 bg, fg-60), active (fg-10 bg, fg-80, Spinner), complete (green bg, white Check)
- Connectors: 24px × 2px lines between cards, color by state

Open/Close:
- sd-slideUp animation on open
- ESC key closes
- X button closes
- UIStore.focusedDomainId drives show/hide

**Details:**

The workspace plate replaces the radial ring view when a domain is active. Content inside depends on domain status (probe/scaffold/validate fan-outs are separate tasks).

Uses Badge primitive for status labels. Uses Card primitive for stage cards. Uses Spinner for active stage.

**Test Strategy:**

1. Plate opens with slide animation when domain clicked
2. Header shows correct domain name with accent dot
3. Pipeline strip shows 5 stages with correct states
4. ESC key closes plate
5. Status badge matches domain state

## Subtasks

### 11.1. Plate container with header (accent dot, name, Badge, close)

**Status:** pending  
**Dependencies:** None  

### 11.2. Pipeline roadmap strip with 5 stage Cards and connectors

**Status:** pending  
**Dependencies:** None  

### 11.3. Stage state rendering (locked/available/active/complete)

**Status:** pending  
**Dependencies:** None  

### 11.4. Open/close animations and ESC handler

**Status:** pending  
**Dependencies:** None  

### 11.5. CSS for plate, roadmap, stages, connectors

**Status:** pending  
**Dependencies:** None  

