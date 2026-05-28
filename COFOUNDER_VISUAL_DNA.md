# Cofounder Visual DNA — Complete Knowledge Base
> **Generated**: 2025-05-28 | **Source**: app.cofounder.co (Harbor Eval org)  
> **Purpose**: Single source of truth for pixel-perfect reproduction. Never scrape again.

---

## 1. SSIM Baseline Score

| Metric | Value |
|--------|-------|
| **Overall SSIM** | **0.9091** |
| Best region | (3,6) = 0.991 |
| Worst region | (0,6) = 0.652 — top-right controls area |

**Worst 5 regions** (need most work):
- `(0,6)` 81%x 10%y → 0.652 — sidebar/controls mismatch
- `(1,6)` 81%x 30%y → 0.747 — right panel content  
- `(0,7)` 94%x 10%y → 0.770 — top-right corner
- `(2,2)` 31%x 50%y → 0.790 — center canvas nodes
- `(0,5)` 69%x 10%y → 0.832 — navbar area

---

## 2. Canvas Architecture

### Node Types (5 total)
| Type | Dimensions | Scale | Purpose |
|------|-----------|-------|---------|
| `departmentNode` | 107×33 | 1.0 | Summary label node (the small rounded pills) |
| `departmentWorkspaceNode` | 529×405 → 114×83 | 0.21 | Miniaturized workspace preview |
| `departmentWorkspaceHomeNode` | 114×83 | varies | Home/default workspace variant |
| `cofounderNode` | ~120×36 | 1.0 | Central "Cofounder" hub node |
| `stagingUrlsNode` | varies | 1.0 | URL staging display |

### Node States (CRITICAL)
| Property | Inactive (Support, Finance, Legal) | Active (Operations, Engineering) |
|----------|-----------------------------------|----------------------------------|
| Background | `#f5f5f2` (--bg-l50) | `#fbfbf8` (--bg-l100) |
| Cursor | `default` | `pointer` |
| Label opacity | `0.3` (--foreground-30) | `0.6` (--foreground-60) |
| Shadow | Flat inset-only (4 layers) | Elevated outset (6 layers) |
| Hover | **NO CHANGE** | **NO CHANGE** |
| Click behavior | Zooms to workspace | Opens expanded workspace panel |

### Inactive Node Shadow (4-layer flat)
```css
box-shadow:
  rgba(0,0,0,0.05) 0px 0px 0px 1px inset,  /* thin dark ring */
  rgb(255,255,255) 0px 0px 0px 0px,          /* white inset (zero) */
  rgba(0,0,0,0) 0px 0px 0px 0px,             /* transparent */
  rgba(0,0,0,0) 0px 0px 0px 0px;             /* transparent */
```

### Active Node Shadow (6-layer elevated)
```css
box-shadow:
  rgb(255,255,255) 0px 0px 0px 0px,             /* white base */
  rgba(32,32,32,0.15) 0px 0px 0px 1px,          /* dark ring */
  rgba(32,32,32,0.04) 0px 0px 20px 0px,         /* ambient glow */
  rgba(32,32,32,0.03) 0px 65px 45px 0px,         /* deep depth */
  rgba(32,32,32,0.03) 0px 50px 35px 0px,         /* mid depth */
  rgba(32,32,32,0.01) 0px 40px 25px 0px;         /* near depth */
```

---

## 3. Expanded Workspace Panel

**Trigger**: Click active node → 1032×751px panel slides in  
**Background**: `rgb(236, 236, 233)` → `--bg-l00` (#ecece9)  
**Border radius**: `22px`

### Internal Components
| Component | Size | Background | Border Radius |
|-----------|------|------------|---------------|
| `department-workspace-summary-shell` | 529×405 | `rgb(236,236,233)` | 12px |
| `department-workspace-summary-message-scaler` | 320×246 | transparent | 0 |
| Agent plate content | 114×83 | transparent | 0 |
| Summary pane | 111×85 | transparent | 0 |
| Pixel art preview cards | 328×195 | `#fff` | 12px |
| Glass panel overlays | 57×180 / 226×80 | `rgba(255,255,255,0.9)` | 8px |

### Task Cards (in expanded workspace)
```css
background: rgb(242, 242, 238);  /* --bg-l25 */
font-size: 16px;
border-radius: 12px;
width: 248px;
height: 72px;
```

### "Mark Complete" Button
```css
background: rgb(79, 79, 79);  /* --foreground-5 mapped */
font-size: 14px;
border-radius: 8px;
width: 142px;
height: 36px;
```

---

## 4. Color System (Light Theme)

### Background Scale
```css
--bg-l00:  #ecece9;   /* workspace/plate bg */
--bg-l25:  #f2f2ee;   /* task cards, secondary surfaces */
--bg-l50:  #f5f5f2;   /* inactive node bg */
--bg-l100: #fbfbf8;   /* active node bg */
--bg-l150: #ffffff;    /* focused/hover bg */
```

### Foreground Scale
```css
--foreground-100: #202020;
--foreground-80:  #20202080;   /* secondary text */
--foreground-60:  #20202099;   /* active labels */
--foreground-30:  #2020204d;   /* inactive labels */
--foreground-10:  #2020201a;   /* borders */
--foreground-5:   #2020200d;   /* subtle borders */
```

### Department Workspace Tokens
```css
--department-workspace-panel:          #fcfcf9fa;
--department-workspace-glass:          #ffffffe6;
--department-workspace-grid-line:      #20202009;
--department-workspace-inset-highlight:#fff;
--department-workspace-muted-surface:  #ffffffeb;
--department-workspace-primary-bg:     #eeeee8e6;
--department-workspace-primary-border: #fff3;
--department-workspace-primary-hover:  #fffffaf5;
--department-workspace-primary-text:   #121215eb;
--department-workspace-raised:         #fff;
--department-workspace-vignette: radial-gradient(
  circle at 50% 52%,
  #ecece900 0%,
  #ecece940 39%,
  #ecece9 90%
);
```

### Border Tokens
```css
--border:    #0000001a;  /* default border */
--border-5:  #0000000d;
--border-8:  #00000014;
--border-10: #0000001a;
--border-20: #0003;
--border-30: #0000004d;
```

---

## 5. Shadow System (62 tokens)

### Key Shadows Used
```css
/* Workspace plate (light) */
--shadow-dept-workspace-plate-light:
  0 3px 3px 0 #fffc,
  0 -3px 2px 0 #0000000d,
  inset 0 4px 4px 0 #0000000f,
  inset 0 2px 2px 0 #00000005,
  inset 0 -1px 1px 0 #fff,
  inset 0 0 0 1px #0000000d;

/* Agent node (light) */
--shadow-dept-agent-node-light:
  inset 0 0 0 1px white,
  0 0 0 1px #00000014,
  0 0 20px #00000008,
  0 65px 45px #00000005,
  0 50px 35px #00000005,
  0 40px 25px #00000003;

/* Inset levels (progressive depth) */
--shadow-inset-050: 0 0 0 1px #0000000d inset, 0 2px 2px -1px #00000014 inset, ...;
--shadow-inset-100: 0 0 0 1px #0000000d inset, 0 -1px 1px 0 #fff inset, 0 2px 2px 0 #0000000d inset, ...;
--shadow-inset-150: ...(deeper);
--shadow-inset-200: ...(deepest);

/* Task card */
--shadow-created-task-card:
  inset 0 0 0 .5px #ffffff59,
  inset 0 1px 0 0 #fff,
  0 0 1px 0 #00000040;

/* Screen containers */
--shadow-light-screen:
  0 3px 3px 0 #00000005 inset,
  0 0 0 .5px #0000000d inset;
```

---

## 6. Typography

### Font Stack (10 families)
| Font | Usage | Weight | Available |
|------|-------|--------|-----------|
| **Figtree** | Primary UI text | 400-700 | ✅ We have this |
| **ttNeoris** | Big headings, hero text | 400-700 | ❌ Need to add |
| **IBM Plex Mono** | Code, monospace | 400 | ❌ Need to add |
| **Pixelify Sans** | Pixel-art labels | 400 | ❌ Need to add |
| **Doto** | Decorative | 400 | ❌ Need to add |
| **EB Garamond** | Serif accents | 400 | ❌ Need to add |
| **Departure Mono** | Alt monospace | 400 | ❌ Need to add |
| **PP Mondwest** | Display | 400 | ❌ Need to add |
| **af** | Brand/custom | 400 | ❌ Need to add |

### Text Styles (Complete - 37 unique styles extracted)
| Context | Font | Size | Weight | Line-height | Letter-spacing | Color |
|---------|------|------|--------|-------------|----------------|-------|
| Node label (inactive) | Figtree | 12px | 500 | 1.2 | - | rgba(32,32,32,0.3) |
| Node label (active) | Figtree | 12px | 500 | 1.2 | - | rgba(32,32,32,0.6) |
| Task title | Figtree | 16px | 500 | 1.3 | - | #202020 |
| Button text | Figtree | 14px | 500 | 1.4 | - | #fff or #202020 |
| Breadcrumb | Figtree | 12px | 400 | 1.4 | - | foreground-60 |
| Hero heading (login) | ppmondwest | 36px | 400 | 40px | - | - |
| Section heading | ttNeoris | 24px | 400 | 27.6px | 0.15px | - |
| Body text | ttNeoris | 15px | 460 | 21px | 0.15px | - |
| Stage label | departureMono | 9px | 400 | 10.78px | - | - |
| Counter badge | departureMono | 8px | 500 | 12px | - | - |
| Inline task name | ttNeoris | 10px | 430 | 10px | 0.1px | - |
| User task label | ttNeoris | 8px | 400 | 9.4px | 0.08px | - |
| Code/path | IBM Plex Mono | 9px | 400 | 16px | - | - |
| Chart axis | IBM Plex Mono | 7px | 400 | 7px | - | - |
| Tagline | af | 18px | 500 | 28px | - | - |
| Auth button | af | 12px | 500 | 12px | 0.12px | - |
| Stat large | ttNeoris | 40px | 400 | 40px | - | - |
| Percentage delta | departureMono | 8px | 400 | 12px | - | - |
| Branding footer | ppmondwest | 16px | 500 | 16px | - | - |
| Terminal text | departureMono | 14.4px | 400 | 20.16px | - | - |

---

## 7. Backdrop Blur System (6 tiers)

```css
/* Progressive blur for UI layering */
backdrop-filter: blur(4px);   /* T1: subtle overlay */
backdrop-filter: blur(8px);   /* T2: panel hover */
backdrop-filter: blur(12px);  /* T3: standard panel */
backdrop-filter: blur(20px);  /* T4: heavy overlay */
backdrop-filter: blur(24px);  /* T5: modal */
backdrop-filter: blur(40px);  /* T6: full-screen overlay */
```

---

## 8. Icons & Graphics

### Pixel-Art Node Icons
- **Format**: 14×14 pixel grid (34×34 SVG viewBox, 4×4 colored rects)
- **Not** simple colored dots — structured pixel art patterns
- **Per-department** unique color/pattern
- Source: inline SVG in node elements

### Department WebP Graphics
- Path: `/pixel-brand-imagery/[department].webp`
- Size: 31-50KB each
- Used in: workspace expanded previews (328×195 cards)
- Resolution: ~660×390px (2x retina)

### Pixel Drift Animation
- CSS var-driven organic wandering particles
- Uses custom keyframes with transform + opacity
- Applied to decorative elements on canvas

---

## 9. Animations & Transitions

### Captured Animations (360 total, 95 keyframes)
Key keyframe names observed:
- `enter`, `exit` — panel open/close
- `fadeIn`, `fadeOut` — opacity transitions
- `slideIn`, `slideOut` — panel slides
- `scaleUp`, `scaleDown` — zoom transitions
- `pulse`, `shimmer` — loading states
- `drift-*` — pixel drift particles
- `spin` — loading spinner

### Transition Patterns
```css
/* Standard panel transition */
transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Node hover (none — NO hover transitions on canvas nodes) */

/* Workspace expand */
transition: transform 0.4s ease, opacity 0.3s ease;
```

---

## 10. Layout & Spacing

### Canvas Grid
- Dot grid pattern on canvas background
- Grid line color: `#20202009` (nearly invisible)
- Canvas vignette: radial gradient from center (transparent → `#ecece9`)

### Spacing Scale
```
4px, 6px, 8px, 10px, 12px, 16px, 20px, 24px, 32px
```

### Border Radius Scale
```
4px (small chips), 6px (cards), 8px (buttons, panels),
12px (workspace cards), 16px (large panels), 22px (workspace container),
full/9999px (pills, avatars)
```

---

## 11. Navbar & Controls

### Top Navbar
- Height: ~48px
- Background: transparent (canvas shows through)
- Backdrop filter: blur(12px)
- Contains: logo, breadcrumbs, action buttons
- Border-bottom: 1px solid `--border-5`

### Canvas Chrome (bottom-right controls)
- Zoom controls, minimap toggle
- Background: `--bg-l100` with `--shadow-inset-050`
- Border-radius: 8px
- Backdrop filter: blur(8px)

---

## 12. Component Inventory (277 variants)

### By Category
| Category | Variants | Key Instances |
|----------|----------|---------------|
| card | 41 | bg-screen layers, pills, chip badges |
| button | 18 | task actions, nav, workspace controls |
| unknown | 194 | handles, decorative, layout wrappers |
| department-node | 2 | departmentNode, cofounderNode |
| workspace-node | 2 | departmentWorkspaceNode, departmentWorkspaceHomeNode |
| workspace-plate | 1 | summary-shell (529×405) |
| agent-plate | 2 | plate + plate-content |
| notch-bar | 5 | notch, notch-stage, notch-blob, notch-trigger, notch-caret |
| task-card | 2 | new-task container + stage |
| flow-node | 2 | nodes container, stagingUrlsNode |
| flow-edge | 2 | edges container, edge labels |
| canvas-chrome | 1 | controls overlay |
| canvas-overlay | 1 | focus backdrop |
| panel | 1 | sidebar panel |
| nav | 1 | breadcrumb nav |
| input | 1 | search/input field |
| review | 1 | review lens host |

### Notch Bar (department workspace mini-control)
The "notch" is a small floating control at the bottom of each workspace node:
```
- department-workspace-notch (container, absolute positioned)
- department-workspace-notch-stage (relative wrapper)
- department-workspace-notch-blob (absolute, flex, the pill shape)
- department-workspace-notch-trigger (relative, flex, clickable area)
- department-workspace-notch-caret (18×18 icon, expand/collapse arrow)
```

---

## 13. Pages Scraped

| Page | URL | Elements | Buttons | Inputs |
|------|-----|----------|---------|--------|
| Canvas | /canvas | 2146 | 86 | 1 |
| Home | / | 1930 | 75 | - |
| Chat | /chat | 123 | 1 | - |
| Tasks | /tasks | 123 | 1 | - |
| Settings | /settings | 273 | 10 | - |

---

## 14. Resource Inventory

| Type | Count | Notable |
|------|-------|---------|
| Script | 46 | Next.js chunks |
| Font | 13 | Figtree, ttNeoris, IBM Plex, Pixelify, Doto, EB Garamond, Departure, Mondwest, af |
| Image | 2 | Pixel brand imagery |
| Stylesheet | 2 | Main app CSS (583KB) |

---

## 15. Files Reference

| File | Location | Size | Content |
|------|----------|------|---------|
| `cofounder_main.css` | `/tmp/audit/final/raw/` | 583KB | Complete raw CSS source |
| `all_css_variables.txt` | `/tmp/audit/final/raw/` | 184KB | 3422 CSS variable declarations |
| `animations_all.json` | `/tmp/audit/final/raw/` | 105KB | 360 animation events |
| `resource_tree.json` | `/tmp/audit/final/raw/` | 10KB | All loaded resources |
| `component_tree.json` | `/tmp/audit/final/components/` | 196KB | 277 component variants with styles |
| `interaction_log.json` | `/tmp/audit/final/components/` | 29KB | 5 full interaction sequences |
| `workspace_expanded_tree.json` | `/tmp/audit/final/components/` | 52KB | 40 workspace elements + 67 buttons |
| `cofounder_interactions.zip` | `/tmp/audit/final/traces/` | 51MB | Playwright trace (viewable in trace.playwright.dev) |
| `page@*.webm` | `/tmp/audit/final/videos/` | 6.6MB | Video recordings of interactions |
| `ssim_report.json` | `/tmp/audit/final/diffs/` | - | SSIM scores + region analysis |
| `side_by_side.png` | `/tmp/audit/final/diffs/` | - | CF vs Harbor side-by-side |
| `ssim_diff_overlay.png` | `/tmp/audit/final/diffs/` | - | Red-highlighted difference overlay |
| `cofounder.har` | `/tmp/audit/deep/` | 42MB | Full HAR with embedded content |
| `GAP_ANALYSIS.md` | `/tmp/audit/deep/` | - | 24 major + 8 micro gaps |

---

## 16. Prioritized Gap Summary

### P0 — Critical (Sprint 1)
- **G2**: Active vs inactive node shadow/state split
- **G5**: Remove hover state changes (Cofounder has NONE)
- **G16**: Fix cursor (default for inactive, pointer for active)

### P1 — Major (Sprint 2-3)
- **G3**: Pixel-art SVG icons (14×14 grid) instead of 5px dots
- **G6**: Add ttNeoris, IBM Plex Mono, Pixelify Sans fonts
- **G7**: Typography scale matching (all text styles)
- **G10**: Backdrop blur system (6 tiers)
- **G11**: Animations (enter/exit/drift)
- **G15**: Canvas vignette radial gradient
- **G23**: Font loading/display strategy

### P2 — Polish (Sprint 4-5)
- **G1**: departmentWorkspaceNode (miniaturized preview plates)
- **G4**: Per-department pixel-art WebP graphics
- **G9**: Notch bar component
- **G18**: Expanded workspace panel (1032×751)
- **G19-G22**: Controls, minimap, edge labels, sidebar

### P3 — Nice-to-have (Sprint 6)
- **G24**: Brand alignment (Cofounder-specific)
- **G17**: Review lens component
- **M1-M8**: Micro polish items

---

## 17. Scrape Coverage & Completeness

### What's Fully Extracted
| Area | Depth | Data Points |
|------|-------|-------------|
| Canvas page DOM | Full computed styles | 2,146 nodes, 277 component variants |
| Canvas interactions | Hover+click+escape | 5 node sequences filmed |
| Expanded workspace | Component tree + buttons | 40 elements, 67 buttons |
| CSS source | Raw text | 583KB main CSS |
| CSS variables | All declarations | 3,422 vars |
| Shadow tokens | All | 62 shadow definitions |
| Animations | Runtime + keyframes | 360 events, 95 @keyframes |
| Typography | All font faces + usage | 10 families, 37 text styles |
| Resource tree | All loaded resources | 46 scripts, 13 fonts, 2 images |
| Login page | Components + styles | 577 components, 37 text styles |
| HAR capture | Full network | 42MB with embedded content |
| Playwright trace | DOM snapshot filmstrip | 51MB |
| Video recording | 30fps interaction | 6.6MB |
| SSIM baseline | Per-region scoring | 0.9091 overall |

### What's Not Captured (non-blocking)
| Area | Reason | Impact |
|------|--------|--------|
| ~~CofounderNode click~~ | ✅ Captured | Adds `?tab=cofounder`, opens setup panel inline |
| ~~StagingUrlsNode click~~ | ✅ Captured | No navigation, stays on canvas |
| ~~Task detail view~~ | ✅ Captured | Inline expansion, 88 buttons, 2 inputs |
| ~~Dropdown menus~~ | ✅ Captured | 2 menu types, tooltip styles |
| ~~Tooltips~~ | ✅ Captured | Dark tooltip + popover styles |
| Chat/Tasks pages | Different pages entirely | None - not part of canvas |

### Additional Findings (Final 5% Scrape)

**Node Count Update**: 21 total nodes on canvas (was seeing fewer before due to viewport):
- 1 cofounderNode, 8 departmentNodes, 5 departmentWorkspaceHomeNodes, 6 departmentWorkspaceNodes, 1 stagingUrlsNode

**CofounderNode Click**: Adds `?tab=cofounder` query param, opens setup panel inline (no modal/navigation).

**StagingUrlsNode**: 260×173 node, click does nothing visible (no modal, no navigation).

**Tooltip Styles** (2 types):
```css
/* Dark tooltip (icon buttons) */
background: rgb(32, 32, 32);
color: rgb(255, 255, 255);
font-size: 12px;
border-radius: 8px;
padding: 8px 12px;
box-shadow: rgba(0, 0, 0, 0.18) 0px 2px 8px 0px;

/* Popover tooltip (workspace cards) */
background: transparent;
color: rgb(32, 32, 32);
font-size: 16px;
border-radius: 6px;
/* Recents list with task items */
```

**Input Styles** (from task detail):
```css
/* Text input */
background: transparent;
border: 1px solid rgba(0, 0, 0, 0.2);
border-radius: 6px;
font-size: 14px;
padding: 4px 12px;
height: 36px;
placeholder: "https://staging.example.com";
```

**Additional Typography** (from workspace):
```
h2  32px  fw=400  ttNeoris     "Your projects."
h3  15px  fw=600  Figtree      "Landing page"
h2  14px  fw=400  IBM Plex Mono "Marketing Dashboard"
h2  34px  fw=400  ttNeoris     "Create the next..."
h3  16px  fw=500  Figtree      "Sales Roadmap"
h3  17px  fw=500  Figtree      "Nothing needs your review"
```

### Auth Note
Cofounder uses `_mw_user` httpOnly cookie with ~30 min expiry. Must re-copy from Firefox profile with WAL checkpoint and use `sameSite: "Lax"` in Playwright. Cookie format:
```json
{"uid":"...", "os":"done", "slug":"harbor-eval-9fb7cd", "oid":"...", "on":"Harbor Eval", "exp":...}
```
