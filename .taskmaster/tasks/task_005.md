# Task ID: 5

**Title:** Radial Ring Canvas: SVG Ring + 8 Domain Nodes + Center Hub

**Status:** pending

**Dependencies:** 1, 2, 3

**Priority:** high

**Description:** The main canvas visualization - a radial ring with 8 domain nodes.

Files:
- src/components/canvas/radial-ring.tsx
- src/components/canvas/empty-canvas.tsx (shown before onboarding)

Canvas area:
- Fixed 600x600 container, centered via flexbox
- No zoom, no pan, no drag - pure positioning

SVG Ring:
- Base circle: center (300,300), r=257px, 1px stroke fg-10
- Progress circle: same center/radius, 2px stroke fg-30
- stroke-dasharray = circumference (2π×257 ≈ 1614.6)
- stroke-dashoffset = circumference × (1 - progress/100)
- rotate(-90) transform to start from top
- 600ms ease-smooth transition on dashoffset

8 Domain Nodes:
- Positioned at 225px radius, 45° apart starting from top (0°)
- Node dimensions: 98px wide
- Outer: 1px border fg-10, rounded-md, bg-l100
- Inner: bg-l200, rounded-sm, padding 8px 10px
- Status dot: 6px circle, positioned inline before label
- Label: Figtree 500 12px fg-60
- Hover: label fg-80, cursor pointer
- Active (selected): 2px border domain-accent, drop shadow
- Click handler: toggle focusedDomainId in UIStore

State-to-Visual Mapping (14 visual states):
- untested: border fg-10, dot fg-20 idle, dashed connection
- probing: 2px accent border + pulseGlow, accent dot + dotPulse, animated dashes, dim others 0.5
- probe_complete: 2px accent border, solid accent dot
- promoted: 2px green border, green dot
- scaffolding: 2px blue border + pulseGlow, blue dot + dotPulse
- published: 2px green border + left green bar, green dot with glow
- rejected: 2px red border, 0.7 opacity
- Plus: redesign, scaffold_queued/complete, validation, gate_passed/failed, sweeping, iterating

Connection Lines:
- SVG lines from 30px from center to 15px from each node
- Style: dashed/solid/animated based on domain state
- Color: fg-20 default, accent/green/blue/purple for active states

Center Hub:
- 98px at center, compass SVG icon 28px
- 'Harbor Eval' wordmark (Figtree 400 10px fg-40)
- Click deselects focused domain

Empty Canvas (before onboarding):
- Centered message with illustration
- 'Begin your evaluation' text + 'Get Started' CTA

**Details:**

The main canvas visualization - a radial ring with 8 domain nodes.

Files:
- src/components/canvas/radial-ring.tsx
- src/components/canvas/empty-canvas.tsx (shown before onboarding)

Canvas area:
- Fixed 600x600 container, centered via flexbox
- No zoom, no pan, no drag - pure positioning

SVG Ring:
- Base circle: center (300,300), r=257px, 1px stroke fg-10
- Progress circle: same center/radius, 2px stroke fg-30
- stroke-dasharray = circumference (2π×257 ≈ 1614.6)
- stroke-dashoffset = circumference × (1 - progress/100)
- rotate(-90) transform to start from top
- 600ms ease-smooth transition on dashoffset

8 Domain Nodes:
- Positioned at 225px radius, 45° apart starting from top (0°)
- Node dimensions: 98px wide
- Outer: 1px border fg-10, rounded-md, bg-l100
- Inner: bg-l200, rounded-sm, padding 8px 10px
- Status dot: 6px circle, positioned inline before label
- Label: Figtree 500 12px fg-60
- Hover: label fg-80, cursor pointer
- Active (selected): 2px border domain-accent, drop shadow
- Click handler: toggle focusedDomainId in UIStore

State-to-Visual Mapping (14 visual states):
- untested: border fg-10, dot fg-20 idle, dashed connection
- probing: 2px accent border + pulseGlow, accent dot + dotPulse, animated dashes, dim others 0.5
- probe_complete: 2px accent border, solid accent dot
- promoted: 2px green border, green dot
- scaffolding: 2px blue border + pulseGlow, blue dot + dotPulse
- published: 2px green border + left green bar, green dot with glow
- rejected: 2px red border, 0.7 opacity
- Plus: redesign, scaffold_queued/complete, validation, gate_passed/failed, sweeping, iterating

Connection Lines:
- SVG lines from 30px from center to 15px from each node
- Style: dashed/solid/animated based on domain state
- Color: fg-20 default, accent/green/blue/purple for active states

Center Hub:
- 98px at center, compass SVG icon 28px
- 'Harbor Eval' wordmark (Figtree 400 10px fg-40)
- Click deselects focused domain

Empty Canvas (before onboarding):
- Centered message with illustration
- 'Begin your evaluation' text + 'Get Started' CTA

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 5.1. SVG ring with base circle and animated progress circle

**Status:** pending  
**Dependencies:** None  

### 5.2. 8 domain nodes positioned at 225px radius, 45° spacing

**Status:** pending  
**Dependencies:** None  

### 5.3. State-to-visual mapping function (14 states → CSS classes)

**Status:** pending  
**Dependencies:** None  

### 5.4. Connection lines SVG from center to each node

**Status:** pending  
**Dependencies:** None  

### 5.5. Center hub with compass icon and wordmark

**Status:** pending  
**Dependencies:** None  

### 5.6. Empty canvas state with CTA

**Status:** pending  
**Dependencies:** None  

### 5.7. Domain node click → UIStore.focusedDomainId toggle

**Status:** pending  
**Dependencies:** None  

### 5.8. Opacity dimming when active domain dims others to 0.5

**Status:** pending  
**Dependencies:** None  

