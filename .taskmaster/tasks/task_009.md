# Task ID: 9

**Title:** Radial Ring Canvas: SVG Ring + 8 Domain Nodes + Center Hub

**Status:** pending

**Dependencies:** 2, 5, 7

**Priority:** high

**Description:** The main canvas visualization. Pure CSS/SVG positioning, no React Flow.

Files:
- src/components/canvas/radial-ring.tsx (~240 lines)
- src/components/canvas/empty-canvas.tsx (~110 lines)

Fixed 600x600 container, centered via flexbox.

SVG Ring:
- Base circle: center (300,300), r=257, 1px stroke fg-10
- Progress circle: same, 2px stroke fg-30, dasharray=2π×257≈1614.6, dashoffset=circ×(1-progress/100), rotate(-90), 600ms ease-smooth transition

8 Domain Nodes at 225px radius, 45° apart:
- Outer: 98px, 1px border fg-10, radius-md, bg-l100
- Inner: bg-l200, radius-sm, padding 8px 10px
- Status dot: 6px circle + label (Figtree 500 12px fg-60)
- Click → UIStore.setFocusedDomain toggle

State-to-Visual Mapping (spec §9.3):
getVisualMapping(status) returns: nodeClass, dotClass, connectionClass, dimOthers
- untested: border fg-10, dot idle, dashed connection
- probing: 2px accent border + pulseGlow, accent dot + dotPulse, animated dashes, dim others 0.5
- probe_complete: 2px accent border, solid accent dot
- promoted/gate_passed: 2px green border, green dot
- scaffolding: 2px blue border + pulseGlow, blue dot + dotPulse
- scaffold_complete: 2px blue border, blue dot
- validation_gate: 2px purple border, purple dot
- published: 2px green border + left green bar, green dot with glow
- rejected: 2px red border, 0.7 opacity
- redesign: 2px amber border, amber dot
- iterating: 2px dashed amber border, amber pulse dot

Connection Lines:
- SVG from 30px from center to 15px from each node
- Style matches domain state (dashed/solid/animated, color)

Center Hub:
- 98px, compass SVG 28px, 'Harbor Eval' wordmark (Figtree 400 10px fg-40)
- Click deselects focused domain

Empty Canvas (before onboarding):
- Centered illustration + heading + 'Get Started' Button (primary)

**Details:**

The radial ring reads from DomainStore.domainStates and UIStore.focusedDomainId.

Performance: use useMemo for visual mapping calculations. Only re-render nodes whose state changed.

All CSS for nodes, connections, hub, and 14 visual states goes in globals.css under a '/* Canvas */'' section.

**Test Strategy:**

1. 8 nodes render at correct positions (check x,y coords)
2. Progress ring fills proportionally to globalProgress
3. Clicking node toggles focusedDomainId
4. Active node gets accent border + shadow
5. When one node is probing, others dim to 0.5 opacity
6. Connection lines match node state colors
7. Center hub click deselects focused domain
8. Empty canvas shows when no project exists

## Subtasks

### 9.1. SVG ring with base and animated progress circles

**Status:** pending  
**Dependencies:** None  

### 9.2. 8 domain nodes at 225px radius, 45° spacing with click handlers

**Status:** pending  
**Dependencies:** None  

### 9.3. getVisualMapping function mapping 14+ states to CSS classes

**Status:** pending  
**Dependencies:** None  

### 9.4. Connection lines SVG with state-based styling

**Status:** pending  
**Dependencies:** None  

### 9.5. Center hub with compass icon and wordmark

**Status:** pending  
**Dependencies:** None  

### 9.6. Empty canvas state with CTA Button

**Status:** pending  
**Dependencies:** None  

### 9.7. CSS for all canvas elements + 14 visual states in globals.css

**Status:** pending  
**Dependencies:** None  

### 9.8. Opacity dimming logic when active domain dims others

**Status:** pending  
**Dependencies:** None  

