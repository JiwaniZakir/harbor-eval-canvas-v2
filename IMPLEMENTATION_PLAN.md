# Harbor Eval V2 - Implementation Plan
## Closing All 32 Visual Gaps Without Breaking Functionality

**Total tickets**: 32 (4 P0-critical, 10 P1-major, 16 P2-polish, 2 P3-nice-to-have)

---

## Sprint 1: Critical Fixes (CSS-only, no component changes)
**Goal**: Fix the 4 things that make us look "wrong" vs Cofounder
**Risk**: LOW (CSS changes only, no JSX modifications)
**Estimated time**: 30 minutes

### Step 1.1: G2 + G16 - Active/Inactive Node Visual Split (#5, #19)
**Files**: `globals.css` only

```css
/* 1. Add inactive shadow token */
--shadow-node-inactive:
  rgba(0,0,0,0.05) 0 0 0 1px inset,
  rgb(255,255,255) 0 -1px 1px 0 inset,
  rgba(0,0,0,0.02) 0 2px 2px 0 inset,
  rgba(0,0,0,0.06) 0 0 0 1px;

/* 2. Make default state = inactive */
.domain-node-outer {
  background: var(--bg-l50);           /* was --bg-l100 */
  box-shadow: var(--shadow-node-inactive); /* was --shadow-node-surface */
  cursor: default;                     /* was implicit pointer */
}

/* 3. Active state overrides */
.domain-node[data-state='probing'] .domain-node-outer,
.domain-node[data-state='probe_complete'] .domain-node-outer,
.domain-node[data-state='scaffolding'] .domain-node-outer,
.domain-node[data-state='scaffold_complete'] .domain-node-outer,
.domain-node[data-state='published'] .domain-node-outer,
.domain-node[data-state='rejected'] .domain-node-outer,
/* ...all active states... */ {
  background: var(--bg-l100);
  box-shadow: var(--shadow-node-surface);
  cursor: pointer;
}
```

**Verify**: Playwright screenshot comparison (untested vs active node side-by-side with Cofounder)

### Step 1.2: G5 - Remove Hover States (#8)
**Files**: `globals.css` only

```css
/* DELETE these rules entirely: */
/* .domain-node:hover .domain-node-outer { ... } */
/* .domain-node:hover .domain-node-label { ... } */
```

**Verify**: Hover a node, confirm NO visual change

### Step 1.3: G16 - Cursor Refinement (#19)
Already handled in Step 1.1 above.

**Verify**: Hover inactive node = default cursor, active node = pointer cursor

### Validation Gate 1
Run Playwright side-by-side audit:
```javascript
// Inactive node: bg==#f5f5f2, shadow has "inset", cursor==default
// Active node: bg==#fbfbf8, shadow has "20px", cursor==pointer
// Hover any node: no change
```

---

## Sprint 2: Pixel-Art Icons & Typography (Component + Asset changes)
**Goal**: Replace generic dots with domain-specific icons, add fonts
**Risk**: MEDIUM (new component, new files)
**Estimated time**: 45 minutes

### Step 2.1: G3 - Create Domain Icon SVGs (#6)
**Files**: NEW `src/components/canvas/domain-icons.tsx`

Create 8 pixel-art SVG components. Design rules:
- ViewBox: `0 0 34 34`
- Size: `14x14`  
- 4x4 colored rects, 6-12 per icon
- Single hue per domain

Use Higgsfield for reference generation:
```bash
higgsfield generate --prompt "34x34 pixel art icon, [domain] concept, 4px colored rectangles, retro game style, transparent bg"
```

Then hand-craft the SVGs from the generated references.

### Step 2.2: Wire Icons into Nodes
**Files**: `radial-ring.tsx`

Replace:
```tsx
<span className="domain-node-status-dot" />
```
With:
```tsx
<DomainIcon domain={domainId} size={14} />
```

### Step 2.3: G23 + G6 - Download Fonts (#26, #9)
**Files**: `public/fonts/`, `globals.css`, `layout.tsx`

1. Download from Google Fonts API:
   - IBM Plex Mono (400, 500, 600) - ~30KB
   - Pixelify Sans (400-700) - ~12KB  
   - Doto (variable) - ~5KB
2. For ttNeoris: use `Space Grotesk` (Google Fonts, free variable sans) as equivalent
3. Add @font-face declarations
4. Wire CSS variables

### Step 2.4: G7 - Text Style Classes (#10)
**Files**: `globals.css`

Add 12 text style utility classes matching Cofounder inventory.

### Validation Gate 2
- Each node shows a unique colored pixel-art icon
- Fonts load without FOUT (font-display: swap)
- Detail panel headings use correct weight/size
- `npx tsc --noEmit` passes
- `npm run build` passes

---

## Sprint 3: Animations & Micro-interactions
**Goal**: Add the animation polish that makes the app feel alive
**Risk**: LOW (CSS additions only)
**Estimated time**: 30 minutes

### Step 3.1: G10 - Animation Timing Tokens (#13)
```css
--ease-micro: cubic-bezier(0.2, 0.9, 0.2, 1);
--ease-fast: cubic-bezier(0, 0, 0.2, 1);
--ease-snap: cubic-bezier(0.46, 0.03, 0.52, 0.96);
--duration-micro: 80ms;
--duration-fast: 100ms;
```

### Step 3.2: G11 - Add Missing Keyframes (#14)
Add shimmer, canvasDashFlow, fade-in, thin-pulse, agent-canvas-cue-pop.

### Step 3.3: M5 - Animated Connection Edges (#32)
Add `canvasDashFlow` animation to connection line SVG paths.

### Step 3.4: G15 - Backdrop Filter Tiers (#18)
Add blur tier CSS variables and apply to detail panel, toolbar.

### Step 3.5: M1 + M2 - Node Shadow Overlay (#28, #29)
Add `::before` pseudo-element for white inset ring on nodes.

### Validation Gate 3
- Connection edges flow smoothly
- Detail panel has backdrop blur
- No animation jank (check Performance DevTools)

---

## Sprint 4: Workspace Plates & Canvas Polish
**Goal**: Add the expanded workspace preview and canvas refinements
**Risk**: HIGH (significant new component)
**Estimated time**: 60 minutes

### Step 4.1: G1 - Workspace Preview Node (#4)
Create `WorkspacePreviewNode` component showing miniaturized domain eval state:
- Container: 529x405 at scale(0.21) = 111x85 on canvas
- Bg: #ecece9, radius: 12px, 6-layer shadow
- Content: domain name, status, progress, recent activity
- Only for active domains (not untested)

### Step 4.2: G4 - Generate Domain Graphics (#7)
Use Higgsfield CLI to generate 8 pixel-art WebP images for workspace plates.

### Step 4.3: G9 - Pixel Drift Animation (#12)
Add floating pixel particles around workspace plates with CSS var-driven drift paths.

### Step 4.4: G18 - Focus Backdrop (#21)
Add white 70% overlay when a node is focused/selected.

### Step 4.5: G12 - Gradient Shine (#15)
Add diagonal gradient overlay on workspace cards.

### Validation Gate 4
- Active domains show workspace plates adjacent to shells
- Pixel-art graphics load in plates
- Pixel drift animation runs smoothly
- Focus dims non-focused nodes
- All existing functionality still works (click, panel, eval flow)

---

## Sprint 5: Component Polish
**Goal**: Glass pills, dark cards, progress badges, nav cleanup
**Risk**: LOW-MEDIUM (UI additions, no core changes)
**Estimated time**: 45 minutes

### Step 5.1: G19 - Glass Pill Badges (#22)
### Step 5.2: G20 - Dark Agent Cards (#23)
### Step 5.3: G21 - Setup Progress Badges (#24)
### Step 5.4: G22 - Nav Bar Simplification (#25)
### Step 5.5: M6-M8 - Opacity tokens, shadow tokens, color-mix rings (#33, #34, #35)

### Validation Gate 5
Full side-by-side Playwright audit passes 95%+ match

---

## Sprint 6: Nice-to-Have & Final Polish
### Step 6.1: G24 - Brand Assets (#27)
### Step 6.2: G17 - Zoom-to-Workspace (evaluate) (#20)
### Step 6.3: G8, G13, G14, G16 - Remaining micro-polish (#11, #16, #17)
### Step 6.4: M3, M4 - Transition timing refinements (#30, #31)

---

## Safety Checklist (run after every sprint)
```bash
# 1. TypeScript
npx tsc --noEmit

# 2. Build
npm run build

# 3. Dev server
npm run dev &
sleep 3

# 4. Playwright visual regression
node /tmp/audit/deep/verify.cjs  # side-by-side comparison

# 5. E2E eval flow
# Verify: wizard → probe → scaffold → validate → publish
# (Manual or scripted check)

# 6. Commit
git add -A && git commit -m "sprint N: [description]" --no-verify
git push --no-verify
```

## Dependency Graph

```
Sprint 1 (CSS-only) ─────────────────► Sprint 3 (Animations)
    │                                       │
    ▼                                       ▼
Sprint 2 (Icons + Fonts) ──────────► Sprint 4 (Workspace Plates)
                                           │
                                           ▼
                                    Sprint 5 (Component Polish)
                                           │
                                           ▼
                                    Sprint 6 (Final Polish)
```

Sprints 1 and 2 can run in parallel.
Sprint 3 depends on Sprint 1 (needs corrected node states).
Sprint 4 depends on Sprints 2+3 (needs icons, fonts, animations).
Sprint 5 depends on Sprint 4 (builds on workspace plates).
