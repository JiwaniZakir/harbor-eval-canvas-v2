# Cofounder.co Deep UI/UX Analysis

> Scraped from live product at `app.cofounder.co` on 2026-05-23, plus analysis of 7 existing reference screenshots.

---

## 1. Layout Architecture

### Main Canvas View (Home)
```
┌─────────────────────────────────────────────────────────────────────┐
│  Warning Banner (full-width, dismissible)                           │
├──────────────────────┬──────────────────────┬───────────────────────┤
│  React Flow Canvas   │  Main Content Area   │  Right Chat Panel     │
│  (Department nodes)  │  (Home/Tasks/etc.)   │  (Always-visible)     │
│  ~240pt wide         │  ~805pt wide         │  ~467pt wide          │
│                      │                      │  Cofounder assistant  │
│  Departments:        │  "Good evening, X"   │                       │
│  • Marketing         │  Roadmap card (9%)   │  "Ask Cofounder..."   │
│  • Finance           │  Suggested Next:     │                       │
│  • Operations        │  • App is built      │  [Attach] [Submit]    │
│  • Sales             │  • Build website     │                       │
│  • Engineering       │  • Sales positioning │                       │
│  • Legal             │  • Brand identity    │                       │
│  • Design            │                      │                       │
│  • Support           │  Archived Tasks      │                       │
├─���────────────────────┴──────────────────────┴───────────────────────┤
│  Bottom Tab Bar: Home | Cofounder | Company | Tasks | Library       │
└─────────────────────────────────────────────────────────────────────┘
```

**Key dimensions (at 1512x865pt viewport):**
- Left canvas: 0-240pt (React Flow department node map)
- Main content: 240-1045pt (scrollable, context-dependent)
- Right panel boundary: x=1045pt (chat drawer)
- Right chat: 1050-1505pt (467pt wide, always present)
- Header height: ~45pt
- Bottom tab bar: ~40pt
- Total usable height: ~780pt

### Onboarding View
- Full-width chat with structured Q&A cards
- Multi-choice options as interactive button lists
- Progress indicator: `1/5`, `2/5`, etc.
- "Skip this question" affordance
- "Decide all" / "Decide this one" action buttons

### Agent Detail View
- Breadcrumb: `harboreval > Operations > Ops Agent`
- Full-width system prompt display
- Skills & Integrations grid
- Model picker
- "Danger Zone" at bottom

---

## 2. Color System

### Light Mode (Default)

| Token | Hex | Usage |
|-------|-----|-------|
| `background` / main canvas | `#f1f1ee` | Warm off-white base, subtle yellow undertone |
| `background-l0` | `#f1f1ee` | Base card/button bg |
| `background-l50` | ~`#f5f5f2` | Hover state |
| `background-l100` | ~`#fbfbf8` | Elevated panels (header, right chat) |
| `background-l200` | ~`#fefefb` | Highest elevation |
| `background-screen` | `#fbfbf8` | Full-screen bg |
| `background-inverse` | `#1a1916` | Dark buttons (CTA) |
| `foreground-100` (text) | `#1a1916` | Primary text (near-black, warm) |
| `foreground-80` | ~`#303030` | Secondary text |
| `foreground-70` | ~`#4f4f4f` | Body text |
| `foreground-60` | ~`#6a6a65` | Muted text, nav labels |
| `foreground-50` | ~`#8a8a85` | Subtle text |
| `foreground-40` | ~`#a5a5a0` | Placeholder text |
| `foreground-30` | ~`#c0c0bb` | Very faint text |
| `foreground-10` | ~`#e0e0db` | Borders |
| `foreground-5` | ~`#ededea` | Hover bg tint |
| `border` | `#D6D2C8` | Card/button borders (warm beige-gray) |
| `border-60` | `rgba(0,0,0,0.06)` | Subtle borders |
| Accent blue | `#1d70d9` | Links, active states |
| Accent blue (bg) | `#dae9fb` | Blue highlight bg |
| Warning yellow | `#e0c040` | Status indicators |
| Canvas panel | `#e7e7e4` | Slightly darker canvas bg |

### Dark Mode

| Token | Hex | Usage |
|-------|-----|-------|
| Main bg | `#1e1e23` | Base (warm purple undertone) |
| Surface | `#29292e` | Elevated panels (header, right chat) |
| Deep bg | `#181820` | Deeper areas |
| Darker still | `#111114` | Panel borders/gaps |
| Light text | `#e0e0e0` | Primary text |
| Muted text | `#505050` | Faint labels |
| Border | `rgba(255,255,255,0.08)` | Dark mode borders |
| Accent | `#1860d8` | Blue accent |
| Warm accent | `#d87830` | Orange/amber accent |

### Critical Observation
Cofounder uses a **warm-tinted neutral** palette, not pure gray. The `#f1f1ee` base and `#1e1e23` dark base both have subtle yellow/purple undertones. This is what makes it feel premium versus generic.

---

## 3. Typography

| Level | Size | Weight | Leading | Usage |
|-------|------|--------|---------|-------|
| Display | `text-xl` | `font-semibold` | - | Section headers |
| Title | `15px` | `font-semibold` | - | Card titles |
| Body | `14px` (`text-sm`) | `font-normal` | `22px` | Chat messages, descriptions |
| Small | `12px` | `font-medium` | - | Button labels, meta text |
| Micro | `11px` | `font-normal` | - | Timestamps, secondary labels |
| Tiny | `9px` | - | - | Fine print |

**Font families:**
- `font-sans`: System font stack (Inter-like)
- `font-tt-neoris`: Display/brand font (custom)

**Text color scale:**
```
foreground-90  - High emphasis text
foreground-80  - Standard body text
foreground-70  - Secondary text (option labels)
foreground-60  - Muted (nav, timestamps)
foreground-50  - Subtle
foreground-40  - Placeholder text
foreground-30  - Very faint
```

---

## 4. Component Patterns

### Buttons

**Option/List Button:**
```css
rounded-[6px] px-3 py-1.5
text-sm leading-[22px] text-foreground-70
hover:bg-foreground-5 hover:text-foreground-90
transition
```

**Action Button (Secondary):**
```css
rounded-[8px] h-8 border border-foreground-10
bg-background-l0 px-2
text-xs font-medium text-foreground-80
shadow-[0_14px_8px_rgba(0,0,0,0.03),
        0_6px_6px_rgba(0,0,0,0.05),
        0_2px_3px_rgba(0,0,0,0.06)]
hover:bg-background-l50
disabled:opacity-60
```

**Primary CTA (Submit):**
```css
rounded-[8px] border border-black/50
bg-background-inverse px-2
text-xs font-medium text-foreground-inverse-80
shadow-[0_2px_3px_rgba(0,0,0,0.2)]
hover:opacity-90
disabled:cursor-not-allowed disabled:opacity-50
```

**Special CTA (Send):**
```css
rounded-[6px] h-8 w-8
border border-foreground-80
background: linear-gradient(0deg, var(--foreground-10)),
            linear-gradient(180deg, var(--background-inverse-100), var(--foreground-100))
shadow-button-special-md
hover:shadow-[0_12px_18px_rgba(0,0,0,0.10),
              0_4px_8px_rgba(0,0,0,0.08),
              inset_0_1px_0_rgba(255,255,255,0.12)]
hover:brightness-110
active:brightness-95
```

**Skip/Tertiary:**
```css
rounded-lg border-[#D6D2C8] bg-[#FCFBF7]
shadow-[0_10px_24px_rgba(26,25,22,0.06)]
hover:bg-white
```

### Navigation Tabs (Bottom Bar)
```css
h-6 rounded px-2 py-1
text-sm font-medium leading-none
text-foreground-60 hover:text-foreground-80
/* Active state uses a sliding indicator behind the tab */
```

### Cards (Suggestion Cards)
- Clean white/off-white bg
- Subtle border (`border-foreground-10`)
- Multi-layer shadow system
- Hover: slight bg change, no dramatic transforms

### Chat Bubbles
- User messages: Right-aligned, subtle bg
- Agent messages: Left-aligned, avatar + name + timestamp
- Tool calls: Collapsible sections with descriptive labels
- Copy button on hover

### ProseMirror Input
```css
.tiptap.ProseMirror
text-[14px] font-normal leading-[24px]
text-foreground-80
caret-caret /* custom cursor color */
min-h-[48px] max-h-[144px]
overflow-y-auto
```

---

## 5. Shadow System

Cofounder uses a **layered shadow** approach with 3 distinct depths:

### Standard Card Shadow
```css
0 14px 8px rgba(0,0,0,0.03),  /* ambient lift */
0 6px 6px rgba(0,0,0,0.05),   /* mid shadow */
0 2px 3px rgba(0,0,0,0.06)    /* contact shadow */
```

### Inset Glass (Light)
```css
inset 0px 0px 0px 1px rgba(0,0,0,0.06),     /* inner ring */
inset 0px -1px 1px 0px rgba(255,255,255,0.7) /* bottom highlight */
```

### Inset Glass (Dark)
```css
inset 0px 0px 0px 1px rgba(255,255,255,0.08),  /* inner ring */
inset 0px -1px 1px 0px rgba(0,0,0,0.45)        /* bottom shadow */
```

### CTA Hover
```css
0 12px 18px rgba(0,0,0,0.10),
0 4px 8px rgba(0,0,0,0.08),
inset 0 1px 0 rgba(255,255,255,0.12)
```

### Skip/Tertiary
```css
0 10px 24px rgba(26,25,22,0.06)  /* warm-tinted shadow */
```

### Key Insight
Shadows use warm-tinted rgba values (`26,25,22` instead of `0,0,0`), matching the warm neutral palette.

---

## 6. Border Radius System

| Level | Value | Usage |
|-------|-------|-------|
| Inner | `3px` | Small inline elements |
| Button/Pill | `6px` | Action buttons, option cards |
| Card/Panel | `8px` | Standard cards, inputs |
| Container | `12px` (sm+) | Larger panels on wider screens |
| Full | `rounded-full` | Avatars, badges |
| Default var | `--border-radius: 8px` | Base token |

---

## 7. Animation & Motion

Observed patterns:
- `transition-colors` on interactive elements
- `transition` (all properties, default timing)
- `duration-200` (200ms standard)
- `hover:brightness-110` / `active:brightness-95` for CTAs
- `disabled:pointer-events-none disabled:opacity-50` for disabled states
- React Flow canvas uses built-in zoom/pan animations
- ProseMirror has smooth caret animation

**Philosophy:** Minimal, functional motion. No decorative animations. Transitions serve to confirm interaction, not to entertain.

---

## 8. Navigation & Information Architecture

### Primary Navigation (Bottom Tab Bar)
```
Home | Cofounder | Company | Tasks | Library
```
- Fixed bottom position
- Pill-style sliding indicator behind active tab
- Small icons + labels
- Dark bg in light mode, blends in dark mode

### Secondary Navigation (Header Breadcrumb)
```
harboreval > [Department] > [Agent Name]
```
- Clickable breadcrumb segments
- Max width truncation

### Header Actions (Right)
```
[Search agents] [Create +] [Inbox] [Dark mode] [Roadmap] [Upgrade] [Avatar]
```

### React Flow Canvas (Left)
- Department nodes as interactive cards
- Visual org chart of the "company"
- Pan/zoom with React Flow
- Nodes show department name + status

### Chat Panel (Right, Always Visible)
- Persistent Cofounder chat
- "Ask Cofounder anything about your company..."
- File attachment support
- Shows in every view

---

## 9. Key Differentiators (What Makes It Feel Premium)

1. **Warm neutrals**: `#f1f1ee` (not pure white/gray) gives editorial, not corporate, feel
2. **Layered shadows**: 3-depth shadow system creates subtle elevation without being heavy
3. **Consistent border radius**: Everything uses `6px` or `8px`, never mixing wildly
4. **Inset highlights**: `inset 0 1px 0 rgba(255,255,255,0.7)` on buttons creates a physical "bevel" illusion
5. **Typography restraint**: Only 2-3 font sizes on screen at once. Body is always 14px.
6. **React Flow canvas**: Department visualization is immediately impressive and differentiated
7. **Always-on chat**: Right panel creates a "co-pilot" feel without dominating
8. **Structured inputs**: Multi-choice questions instead of free text when possible
9. **Progressive disclosure**: Tool calls collapse, questions collapse after answering
10. **Warm-tinted shadows**: `rgba(26,25,22,...)` not `rgba(0,0,0,...)` matches the palette

---

## 10. Actionable Recommendations for Harbor Eval Studio

### Adopt
1. **Warm-tinted dark bg**: Change `#09090b` to `#0d0d11` or `#111116` (slight purple/blue undertone matches our accent)
2. **Layered shadow system**: Replace single-layer shadows with 3-depth approach (ambient + mid + contact)
3. **Consistent radius**: Standardize on `6px` (pills), `12px` (cards), `16px` (panels) - stop mixing
4. **Always-visible chat**: Our companion panel approach is correct - Cofounder validates this pattern
5. **Structured approval gates**: Their multi-choice Q&A cards are essentially our approval gates. Make ours feel as polished.
6. **Progressive disclosure**: Collapse completed tool calls and stage details by default
7. **Warm-tinted shadows**: Use `rgba(124,92,252,0.04)` in shadows (purple tint to match accent)
8. **ProseMirror-quality input**: Their composer is a full rich-text editor, not a textarea

### Adapt (Not Copy)
1. **Bottom tab bar**: Their nav is bottom-fixed. We use top-bar stage indicators, which is better for our linear pipeline metaphor.
2. **Light theme**: They default light. We're dark, which is correct for our developer audience.
3. **React Flow canvas**: They use it for org chart. We could consider it for the build stage's task node visualization.
4. **Department metaphor**: They organize by business departments. We organize by pipeline stages. Our approach is sharper for the use case.

### Skip
1. Font-tt-neoris: Custom display font is unnecessary for us
2. Full React Flow: Too heavy for our use case; our stage sections are better
3. Onboarding wizard: We don't need one - the welcome hero + workflow description IS our onboarding

---

## Appendix: Raw CSS Tokens Extracted

### Tailwind Classes Found in DOM

**Backgrounds:**
`bg-background`, `bg-background-l0`, `bg-background-l50`, `bg-background-l100`, `bg-background-l200`, `bg-background-screen`, `bg-background-inverse`, `bg-canvas-panel-light`, `bg-foreground-5`, `bg-border-60`

**Text:**
`text-foreground-30` through `text-foreground-80`, `text-foreground/60`, `text-foreground/90`, `text-foreground-inverse-80`, `text-foreground-inverse-90`, `text-black/60`

**Borders:**
`border-foreground-10`, `border-black/[0.06]`, `border-black/50`, `border-[#D6D2C8]`

**Shadows:**
```
shadow-outset-100
shadow-outset-150
shadow-screen
shadow-button-special-md
shadow-md
```

**Semantic Colors:**
```
--error-bg: hsl(359, 100%, 97%)     / hsl(358, 76%, 10%)
--error-text: hsl(360, 100%, 45%)   / hsl(358, 100%, 81%)
--success-bg: hsl(143, 85%, 96%)    / hsl(150, 100%, 6%)
--success-text: hsl(140, 100%, 27%) / hsl(150, 86%, 65%)
--warning-bg: hsl(49, 100%, 97%)    / hsl(64, 100%, 6%)
--warning-text: hsl(31, 92%, 45%)   / hsl(46, 87%, 65%)
--info-bg: hsl(208, 100%, 97%)      / hsl(215, 100%, 6%)
--info-text: hsl(210, 92%, 45%)     / hsl(216, 87%, 65%)
```

**Gray Scale:**
```
--gray1: hsl(0, 0%, 99%)    --gray7: hsl(0, 0%, 85.8%)
--gray2: hsl(0, 0%, 97.3%)  --gray8: hsl(0, 0%, 78%)
--gray3: hsl(0, 0%, 95.1%)  --gray9: hsl(0, 0%, 56.1%)
--gray4: hsl(0, 0%, 93%)    --gray10: hsl(0, 0%, 52.3%)
--gray5: hsl(0, 0%, 90.9%)  --gray11: hsl(0, 0%, 43.5%)
--gray6: hsl(0, 0%, 88.7%)  --gray12: hsl(0, 0%, 9%)
```
