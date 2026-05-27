# Cofounder.co Exhaustive Interaction & Architecture Audit

> Extracted from live product at `app.cofounder.co/org/harboreval-8387fb/canvas`
> Date: 2025-01-24 | Mode: Dark & Light analyzed | Resolution: 1512x865 (2x)

---

## Table of Contents

1. [Overall Architecture](#1-overall-architecture)
2. [Central Hub (Cofounder Node)](#2-central-hub)
3. [Department Agent Nodes](#3-department-agent-nodes)
4. [Department Workspace Panels](#4-department-workspace-panels)
5. [Tech Tree / Roadmap System](#5-tech-tree--roadmap)
6. [Right-Hand Chat Panel](#6-right-hand-chat-panel)
7. [Navigation System](#7-navigation-system)
8. [Agent Configuration Panel](#8-agent-configuration-panel)
9. [Company View](#9-company-view)
10. [Design Token System (Complete)](#10-design-token-system)
11. [Shadow & Depth System](#11-shadow--depth-system)
12. [Animation & Transition Patterns](#12-animations--transitions)
13. [Component Patterns](#13-component-patterns)
14. [Harbor Adaptation Notes](#14-harbor-adaptation-notes)

---

## 1. Overall Architecture

### Three-Panel Layout

```
┌──────────────────────────────────────────────────────────────────────┐
│  Top Bar: [ZJ] [harboreval ▾] ··· [Upgrade] [☀] [📋] [🔍] [+] [📥]│
├──────────────────────┬───────────────────┬───────────────────────────┤
│                      │                   │                           │
│   React Flow Canvas  │   Center Column   │   Always-Visible Chat     │
│   (department nodes  │   (Home / Tasks / │   (~467pt wide)           │
│    in octagon)       │    Company /       │                           │
│                      │    Library)        │   "Cofounder" badge       │
│   8 dept nodes       │                   │   Message history          │
│   + center hub       │   Roadmap card    │                           │
│   + workspace plates │   Suggested tasks │   Input area:             │
│                      │   Archived tasks  │   [Ask Cofounder...]      │
│                      │                   │   [📎] [Submit]           │
├──────────────────────┴───────────────────┴───────────────────────────┤
│  Bottom Tab Bar: [Home] [Cofounder] [Company] [Tasks] [Library]     │
└──────────────────────────────────────────────────────────────────────┘
```

### React Flow Viewport

- Transform: `translate(522px, 432.5px) scale(0.555)`
- CSS variables on viewport:
  - `--canvas-department-landmark-scale: 1.25`
  - `--canvas-department-card-scale: 1.25`
  - `--canvas-department-card-visual-scale: 1.25`
  - `--canvas-cofounder-landmark-scale: 1.45`

---

## 2. Central Hub (Cofounder Node)

### Position & Identity

- Node ID: `department-overview-center`
- Canvas position: `translate(-49px, -29px)` → Screen: `(494.8, 416.4)`
- Z-index: **60** (highest, floats above all department nodes)
- Node type: `cofounderNode`

### Visual Design

- **Container**: `w-[98px]` wide, `overflow-visible`
- **Outer shell**: `rounded-[8px] p-[2px] bg-background-l100 shadow-outset-150`
  - Hover: `bg-background-l50 shadow-outset-050`
- **Inner frame**: `h-[54px] w-full rounded-[6px] bg-background-screen shadow-screen`
  - `flex items-center justify-center overflow-hidden`
- **Icon**: ASCII sunflower image (`/asciisunflower.png`, 228x442, displayed at `h-[42px] w-auto`)
- **Total height**: 58px with scale transform
- **Screen reflectance effect**:
  ```css
  background: linear-gradient(135deg, var(--screen-reflectance-start) 0%, var(--screen-reflectance-end) 60%);
  clip-path: polygon(0px 0px, 100% 0px, 85% 100%, 0px 100%);
  ```
- **Logo**: `h-[16px] w-auto text-foreground-60` (Cofounder wordmark below)

### Connection Handles

- 4 handles: top, right, bottom, left (all transparent, zero-size)
- `!h-0 !w-0 !border-0 !bg-transparent opacity-0`
- Source handles only (center → departments)

---

## 3. Department Agent Nodes

### Octagonal Layout (canvas coordinates)

| Department   | Canvas X  | Canvas Y  | Screen X | Screen Y | Accent Color |
|:-------------|----------:|----------:|---------:|---------:|:-------------|
| Support      | -86.5     | -512.0    | 474.0    | 148.4    | TBD          |
| Operations   | 256.4     | -369.9    | 664.3    | 227.2    | `#B16A27`    |
| Finance      | 398.5     | -27.0     | 743.2    | 417.5    | `#4087F2`    |
| Legal        | 256.4     | 315.9     | 664.3    | 607.8    | TBD          |
| Engineering  | -86.5     | 458.0     | 474.0    | 686.7    | TBD          |
| Design       | -429.4    | 315.9     | 283.7    | 607.8    | `#8A72E5`    |
| Marketing    | -571.5    | -27.0     | 204.8    | 417.5    | `#80A740`    |
| Sales        | -429.4    | -369.9    | 283.7    | 227.2    | `#F46746`    |

All department nodes at **z-index: 50**.

### Node Card Design

- **Selector**: `div.group/department-node`
- **Size**: `95.9px × 30px` (each node card)
- **Node class**: `react-flow__node-departmentNode dept-node`
- **Card styling**:
  ```css
  padding: 6px 10px;
  border-radius: 8px;
  box-shadow:
    var(--shadow-inset-200),
    0 0 0 1px color-mix(in srgb, var(--foreground-100) 7%, transparent),
    0 6px 14px color-mix(in srgb, var(--foreground-100) 4%, transparent);
  ```
- **Label**: `text-[12px] font-normal leading-[1.2] text-foreground-60`
  - Font: system `font-sans`
  - Center: `inline-block whitespace-nowrap text-center`

### "Not Setup" Glow Effect

For departments not yet configured:
```css
/* Outer glow ring */
.department-not-setup-glow {
  box-shadow:
    0 0 0 2px color-mix(in srgb, var(--foreground-100) 3%, transparent),
    0 8px 18px color-mix(in srgb, var(--foreground-100) 4%, transparent);
}

/* Inner glow overlay */
.pointer-events-none.absolute.-inset-[3px].rounded-[12px].opacity-70
  transition-opacity duration-200
  group-hover:opacity-90
```

### Inner Card Layers (from bottom to top)

1. **Background**: `bg-background-l50` (panel surface)
2. **Content wrapper**: `relative flex min-w-0 items-center justify-center rounded-[inherit]`
3. **Inset shadow overlay**: `pointer-events-none absolute inset-0 rounded-[inherit]`
   ```css
   box-shadow:
     inset 0px 0px 0px 1px rgba(0,0,0,0.05),
     inset 0px 2px 2px -1px rgba(0,0,0,0.08);
   ```

---

## 4. Department Workspace Panels

Behind each department node, there's a **workspace plate** (z=0) and **workspace home** (z=1).

### Node Types

- `dept-workspace-plate-{uuid}` — Background plate (z-index: 0)
- `dept-workspace-home-{uuid}` — Active workspace content (z-index: 1)

### Workspace Home Content (Operations example)

```
Operations Department

Operations agent ready

Handle every moving piece of your business

[Mark complete →]

Operations Roadmap  0/3 Setup  [■■■■]
├── Incorporate LLC      (Needs your input)
├── Open bank account    (Needs earlier steps) 🔒
└── Setup bookkeeping    (Needs earlier steps) 🔒
```

### Workspace Styling

- Container: `overflow-visible bg-transparent text-foreground`
- Inner panel: `isolate flex min-h-0 flex-1 flex-col overflow-hidden rounded-[22px] bg-background-l-negative-50 p-3 shadow-inset-200`
- Accent color: `color: var(--department-workspace-accent)`

### Department CSS Variable System

Each department sets these CSS variables:

| Variable | Purpose | Example Value |
|:---------|:--------|:-------------|
| `--department-workspace-accent` | Primary accent | `#8A72E5` (Design) |
| `--department-workspace-accent-soft` | Tinted backgrounds | `rgba(138,114,229,0.18)` |
| `--department-workspace-glass` | Glass panel bg | Contextual |
| `--department-workspace-inset-highlight` | Inner border glow | Contextual |
| `--department-workspace-raised` | Raised surface bg | Contextual |
| `--department-workspace-muted-surface` | Muted bg | Contextual |
| `--department-workspace-primary-bg` | CTA button bg | Computed from accent |
| `--department-workspace-primary-border` | CTA button border | Computed |
| `--department-workspace-primary-hover` | CTA hover state | Computed |
| `--department-workspace-primary-text` | CTA text color | Computed |

### Primary Action Button (per-department themed)

```css
.department-primary-button {
  display: inline-flex;
  height: 36px; /* h-9 */
  min-width: 32px; /* min-w-8 */
  align-items: center;
  justify-content: center;
  gap: 6px; /* gap-1.5 */
  border-radius: 8px; /* rounded-lg */
  border: 1px solid var(--department-workspace-primary-border);
  background: var(--department-workspace-primary-bg);
  padding: 0 12px; /* px-3 */
  font-size: 14px; /* text-sm */
  font-weight: 500; /* font-medium */
  line-height: 22px;
  color: var(--department-workspace-primary-text);
  box-shadow:
    0 13px 5px rgba(0,0,0,0.03),
    0 7px 4px rgba(0,0,0,0.07),
    0 3px 3px rgba(0,0,0,0.14),
    0 1px 2px rgba(0,0,0,0.19),
    inset 0 1.5px 0 rgba(255,255,255,0.35);
  transition: all;
}

.department-primary-button:hover {
  background: var(--department-workspace-primary-hover);
}
```

### Browser Frame Preview Cards

Each workspace shows a miniature browser window preview:

```css
.browser-preview {
  width: 328px; /* in workspace home */
  height: 195px;
  overflow: hidden;
  border-radius: 12px; /* rounded-xl */
  background: var(--department-workspace-raised);
  box-shadow:
    0 0 0 1px var(--foreground-8),
    0 0 20px rgba(0,0,0,0.03),
    0 36px 28px rgba(0,0,0,0.02),
    0 25px 25px rgba(0,0,0,0.02),
    0 15px 15px rgba(0,0,0,0.02),
    inset 0 0 0 1px var(--department-workspace-inset-highlight);
}

.browser-preview:hover {
  transform: translateY(-2px);
  box-shadow:
    0 0 0 1px var(--foreground-10),
    0 0 24px var(--department-workspace-accent-soft),
    0 36px 28px rgba(0,0,0,0.025),
    inset 0 0 0 1px var(--department-workspace-inset-highlight);
}

/* Title bar */
.browser-preview .title-bar {
  height: 30px;
  background: var(--department-workspace-accent-soft);
}

/* Traffic light dots */
.traffic-dots {
  left: 12px; top: 12px;
  gap: 6px; /* gap-1.5 */
}
.dot-close   { size: 6px; border-radius: 50%; background: #ff6d55; }
.dot-minimize { size: 6px; border-radius: 50%; background: #ffd05a; }
.dot-maximize { size: 6px; border-radius: 50%; background: #53c56d; }

/* URL text */
.browser-preview .url {
  font-size: 11px;
  line-height: 22px;
  color: var(--foreground-40); /* text-foreground-40 */
  text-align: center;
}

/* Glass panel inside browser */
.browser-inner-panel {
  border: 1px solid var(--department-workspace-accent-soft);
  background: var(--department-workspace-glass);
  box-shadow:
    inset 0 1px 1px var(--department-workspace-inset-highlight),
    inset 0 -1px 1px rgba(0,0,0,0.04);
}

/* Shimmer animation on glass panels */
.shimmer {
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 36%,
    rgba(255, 255, 255, 0.72) 48%,
    transparent 60%,
    transparent 100%
  ) 0% 0% / 260% 100%;
  animation: 5.5s linear infinite shimmer;
}
```

---

## 5. Tech Tree / Roadmap

### Overview

The Tech Tree is a fullscreen React Flow overlay triggered by:
- Clicking "Harboreval Roadmap" card → `?open_tech_tree=1`
- Clicking any suggested task → same URL param
- Clicking department roadmap titles

### Stage Progression System

```
BUILD STAGE     0/8    →  App built, marketing site, etc.
LAUNCH STAGE    0/4    →  Launch app, billing, marketing site
SCALE STAGE     0/7    →  SEO, auth, referral, support agent
```

### Task States

| State | Display | Icon |
|:------|:--------|:-----|
| `available` / Complete task | Actionable CTA | ✓ |
| `Needs earlier steps` | Greyed, locked | 🔒 |
| `Needs your input` | User action required | ✋ |
| `Needs approval` | Review pending | 👁 |
| `Completed` | Done | ✓ filled |
| `Provision resource` | System action | ⚙ |

### Roadmap Step Card

```css
.roadmap-step-card {
  width: 248px;
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid;
  background: var(--background-screen);
  padding: 6px;
  text-align: left;
  transition: border-color, box-shadow, opacity, transform 150ms ease-out;
}

.roadmap-step-card:not(:disabled) {
  border-color: var(--foreground-15);
}

.roadmap-step-card:not(:disabled):hover {
  transform: translateY(-1px);
  border-color: var(--foreground-20);
}
```

### Step Icon

```css
.step-icon {
  width: 48px;
  height: 48px;
  flex-shrink: 0;
  border-radius: 6px;
  box-shadow:
    0 0.333px 0 rgba(0,0,0,0.2),
    0 0.667px 0.667px var(--white-100),
    0 0 1.333px rgba(0,0,0,0.3);
}

/* Icon uses CSS mask for SVG coloring */
.step-icon-mask {
  width: 24px;
  height: 24px;
  background-color: var(--foreground-50);
  mask-image: url("/tech-tree-icons/setup.svg");
  mask-size: contain;
}
```

### Roadmap Progress Bar

```css
.progress-bar {
  display: flex;
  gap: 4px; /* gap-1 */
}
.progress-segment {
  height: 3px;
  width: 12px; /* w-3 */
  background: var(--foreground-10); /* unfilled */
}
.progress-segment.filled {
  background: var(--department-workspace-accent);
}
```

### Roadmap Header

```css
.roadmap-header {
  font-family: monospace; /* font-mono */
  font-size: 12px; /* text-xs */
  line-height: 16px; /* leading-4 */
  color: var(--foreground-70);
}
.roadmap-header:hover {
  color: var(--foreground-90);
}
.roadmap-count {
  font-size: 12px;
  color: var(--foreground-80);
}
```

---

## 6. Right-Hand Chat Panel

### Panel Structure

The chat is **always visible** on the right side, approximately 467pt wide.

### Cofounder Badge (Chat Context Selector)

```css
.cofounder-badge {
  display: inline-flex;
  height: 28px; /* h-7 */
  max-width: 100%;
  align-items: center;
  gap: 6px; /* gap-1.5 */
  border-radius: 6px;
  padding: 0 8px; /* px-2 */
  font-size: 12px;
  font-weight: 500; /* font-medium */
  line-height: 1;
  user-select: none;
  overflow: hidden;
  cursor: pointer;
}

/* Light mode gradient */
.cofounder-badge.light {
  background: linear-gradient(180deg, #EFEFEC 0%, rgba(239,239,236,0.50) 100%);
}

/* Dark mode gradient */
.cofounder-badge.dark {
  background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%);
}
```

### Chat Input Area

```css
.chat-input-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  padding: 12px;
  border: 1px solid var(--foreground-10);
  backdrop-filter: blur(12px); /* backdrop-blur-md */
  border-radius: 8px;
  background: var(--background-l200-90);
  box-shadow: 0 8px 24px rgba(0,0,0,0.5); /* dark mode */
  transition: box-shadow 300ms ease-in-out;
}

.chat-input-textarea {
  /* Auto-expanding textarea */
  min-height: 24px;
  max-height: 144px;
  placeholder-color: var(--foreground-30);
}
```

### Input Actions

- **Attach button** (radix dropdown): `📎 Attach files and other actions`
- **Submit button**: Primary action
- **Icons**: Plus (`+`) and chart bar icons in the action area

### Suggested Task Items in Chat Panel

```css
.suggested-task-item {
  display: flex;
  min-width: 0;
  flex: 1;
  align-items: center;
  gap: 10px;
  text-align: left;
  cursor: pointer;
}
.suggested-task-label {
  font-size: 13px;
  line-height: 18px;
  color: var(--foreground-90);
}
```

---

## 7. Navigation System

### Top Bar

- Height: ~44px
- Background: transparent (floating over canvas)
- Layout: `flex items-center`

**Left Section:**
- User avatar: `[ZJ]` badge
- Org selector: `harboreval ▾` — `max-w-[160px] truncate rounded-[4px] px-1.5 py-0.5 text-xs font-medium text-white/85 hover:bg-white/10`

**Right Section (pointer-events-none container with pointer-events-auto children):**
- `[Upgrade]` button — premium upsell
- `[☀/🌙]` theme toggle — "Switch to light/dark mode"
- `[📋]` Open Roadmap
- `[🔍]` Search agents
- `[+]` Open create menu
- `[📥]` Open inbox

### Bottom Tab Bar

Five tabs arranged horizontally at the bottom center:

| Tab | Function | Notes |
|:----|:---------|:------|
| **Home** | Default canvas + suggestions | Shows "Good evening, Zakir", roadmap card, suggested tasks |
| **Cofounder** | AI chat focus | Centers the chat experience |
| **Company** | Settings & config | Stack, domain, email, payment, hosting, links, agents |
| **Tasks** | Task list per agent | Opens agent detail with task list, "New task" button |
| **Library** | Knowledge base | Documents, files, context for agents |

### Tab Button Styling

```css
.nav-tab {
  position: relative;
  z-index: 10;
  display: inline-flex;
  height: 24px;
  cursor: pointer;
  align-items: center;
  justify-content: center;
  gap: 4px;
  border-radius: 4px; /* rounded */
  padding: 4px 8px; /* px-2 py-1 */
  font-family: system-ui; /* font-sans */
  font-size: 14px; /* text-sm */
  font-weight: 500; /* font-medium */
  line-height: 1;
  transition: color;
}
.nav-tab.active {
  color: var(--foreground); /* full opacity */
}
.nav-tab.inactive {
  color: var(--foreground-60);
}
.nav-tab.inactive:hover {
  color: var(--foreground-80);
}
```

### Active Tab Indicator

```css
.tab-indicator {
  position: absolute;
  top: 0;
  height: 100%;
  background: var(--foreground-10);
  border-radius: 4px;
  transition: left 200ms, width 200ms;
}
/* e.g., left: 0px; width: 54.3px; opacity: 1; */
```

---

## 8. Agent Configuration Panel

When clicking into a department's Tasks tab, a full agent config panel opens.

### Panel Structure

```
┌─────────────────────────────────────────┐
│ [← Go back]  Ops Agent                 │
│              Default           [New task]│
├─────────────────────────────────────────┤
│ ┌─[Suggested Next]────────────────────┐ │
│ │ Start an ops workflow               │ │
│ │ Launch a focused operational run... │ │
│ │                                     │ │
│ │ [Start reconciliation queue]        │ │
│ │ [Daily ops brief] [Cross-system...] │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─[Tasks]─────────────────────────────┐ │
│ │ No tasks yet                        │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─[Routines]──────────────────────────┐ │
│ │ (empty)                             │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─[Agent Context] ①──────────────────┐ │
│ │ System prompt (long, scrollable)    │ │
│ │ [Show more]                         │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─[Model + Skills]───────────────────┐ │
│ │ Model: Claude Sonnet 4.6           │ │
│ │ Skills: ops-agent-skills           │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─[Integrations] 13───────���─────────┐ │
│ │ Metabase, Spreadsheet, Gmail,      │ │
│ │ Agentmail, Slack, Notion,          │ │
│ │ Airtable, Attio, +5 more          │ │
│ │ [Manage] [Connect More] [Add MCP]  │ │
│ └─────────────────────────────────────┘ │
│                                         │
│ ┌─[Danger Zone]──────────────────────┐ │
│ │ Default agents cannot be deleted.   │ │
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

### Top Bar (in agent view)

When inside an agent, the top bar adds breadcrumbs:
```
[harboreval] > [Operations] > [Ops Agent]
```

### Accordion Sections

Each section uses a collapsible accordion pattern:
- Section header: `font-sans text-sm font-medium`
- Badge count (e.g., "① " on Agent Context, "13" on Integrations)
- Sections: `overflow-hidden` with animated height

### Workflow Starter Cards

```
Start an ops workflow
Launch a focused operational run for reconciliation,
reporting, or cross-system cleanup without writing
the prompt from scratch.

[Start reconciliation queue]
[Daily ops brief ─ Create a concise operating brief...]
[Cross-system cleanup ─ Find inconsistent revenue...]
```

---

## 9. Company View

The Company tab shows organization settings:

```
harboreval

Stack
├── Domain         [Requires setup →]
├── Email          (configured)
├── Payment        (configured)
├── Hosting        Vercel
└── Links
    ├── App
    │   ├── Production:  app.harboreval-8387fb.cofounder.company
    │   ├── Staging:     staging.app.harboreval-8387fb.cofounder.company
    │   ├── Repository:  github.com/Cofounder-Customer-Projects-1/harboreval-8387fb
    │   └── Vercel:      vercel.com/...
    └── Marketing Website
        ├── Production:  harboreval-8387fb.cofounder.company
        ├── Staging:     staging.harboreval-8387fb.cofounder.company
        ├── Repository:  github.com/...
        └── Vercel:      vercel.com/...

Agents
├── Design
├── Engineering
├── Finance
├── Legal
├── Marketing
├── Operations
├── Sales
└── Support
```

### Link Card Styling

Link cards show deployment URLs with hover states and external link indicators.

---

## 10. Design Token System (Complete)

### Color Tokens

#### Foreground Scale (opacity-based)

| Token | Usage | Meaning |
|:------|:------|:--------|
| `foreground-5` | Faint separators | Nearly invisible |
| `foreground-8` | Border outlines | Subtle structure |
| `foreground-10` | Borders, dividers | Light structure |
| `foreground-15` | Card borders | Visible structure |
| `foreground-20` | Hover borders | Interactive |
| `foreground-30` | Placeholder text | Low emphasis |
| `foreground-40` | URL text, captions | Reduced emphasis |
| `foreground-50` | Icons, mask colors | Medium emphasis |
| `foreground-55` | Secondary icons | Medium |
| `foreground-60` | Inactive tabs, labels | Default text |
| `foreground-70` | Roadmap titles | Readable |
| `foreground-80` | Task names, counts | High readability |
| `foreground-90` | Primary content | High emphasis |
| `foreground-100` | Full contrast | Maximum emphasis |

#### Background Scale

| Token | Light | Dark |
|:------|:------|:-----|
| `background-l-negative-50` | Deeper inset | Deeper inset |
| `background-l0` | White | Near-black |
| `background-l50` | Slight off-white | Slight gray |
| `background-l100` | Off-white `#f1f1ee` | Dark `#1e1e23` |
| `background-l200` | Warm gray | Darker gray |
| `background-l200-90` | 90% opacity variant | 90% opacity |
| `background-screen` | Screen-like surface | Screen-like surface |
| `background-inverse-100` | Inverted | Inverted |

#### Department Accent Palette

| Department | Accent | Soft (18% mix) | Description |
|:-----------|:-------|:---------------|:------------|
| Design | `#8A72E5` | `rgba(138,114,229,0.18)` | Purple |
| Marketing | `#80A740` | `rgba(128,167,64,0.2)` | Green |
| Sales | `#F46746` | `rgba(244,103,70,0.18)` | Red-orange |
| Operations | `#B16A27` | `rgba(177,106,39,0.18)` | Warm amber |
| Finance | `#4087F2` | `rgba(64,135,242,0.18)` | Blue |
| Engineering | TBD | TBD | TBD |
| Legal | TBD | TBD | TBD |
| Support | TBD | TBD | TBD |

### Gray Scale (Radix-based)

```css
--gray1: hsl(0, 0%, 99%);
--gray2: hsl(0, 0%, 97.3%);
--gray3: hsl(0, 0%, 95.1%);
--gray4: hsl(0, 0%, 93%);
--gray5: hsl(0, 0%, 90.9%);
--gray6: hsl(0, 0%, 88.7%);
--gray7: hsl(0, 0%, 85.8%);
--gray8: hsl(0, 0%, 78%);
--gray9: hsl(0, 0%, 56.1%);
--gray10: hsl(0, 0%, 52.3%);
--gray11: hsl(0, 0%, 43.5%);
--gray12: hsl(0, 0%, 9%);
```

### Semantic Colors

```css
/* Error */
--error-bg:     hsl(359, 100%, 97%);   /* light */
--error-bg:     hsl(358, 76%, 10%);    /* dark */
--error-border: hsl(359, 100%, 94%);   /* light */
--error-border: hsl(357, 89%, 16%);    /* dark */
--error-text:   hsl(360, 100%, 45%);   /* light */
--error-text:   hsl(358, 100%, 81%);   /* dark */

/* Success */
--success-bg:     hsl(143, 85%, 96%);
--success-border: hsl(145, 92%, 87%);
--success-text:   hsl(140, 100%, 27%);

/* Warning */
--warning-bg:     hsl(49, 100%, 97%);
--warning-border: hsl(49, 91%, 84%);
--warning-text:   hsl(31, 92%, 45%);

/* Info */
--info-bg:     hsl(208, 100%, 97%);
--info-border: hsl(221, 91%, 93%);
--info-text:   hsl(210, 92%, 45%);
```

### Typography

| Element | Size | Weight | Line Height | Font |
|:--------|:-----|:-------|:------------|:-----|
| Body text | 14px (`text-sm`) | 400 | 22px | `font-sans` (system) |
| Small text | 13px | 500 | 18px | `font-sans` |
| Labels | 12px (`text-xs`) | 400-500 | 1.2 | `font-sans` |
| URL text | 11px | 400 | 22px | `font-sans` |
| Mono labels | 12px | 400 | 16px | `font-mono` |
| Roadmap title | 14px | 600 | 18px | `font-sans` |
| Display | Variable | 700 | 1.2 | `font-tt-neoris` |

### Border Radius Scale

| Size | Usage |
|:-----|:------|
| `3px` | Tiny inner elements |
| `4px` | Tabs, small pills, nav items |
| `5px` | Small icons |
| `6px` | Buttons, badges, inner frames |
| `8px` | Cards, inputs, node containers |
| `12px` | Larger cards, roadmap steps, containers |
| `22px` | Workspace panels, large containers |

---

## 11. Shadow & Depth System

### Named Shadow Variables

| Shadow | Usage |
|:-------|:------|
| `shadow-outset-050` | Subtle outer shadow (hover state) |
| `shadow-outset-150` | Medium outer shadow (default state) |
| `shadow-inset-200` | Inner shadow for panels |
| `shadow-screen` | Screen-like panel shadow |

### Explicit Shadow Recipes

#### Card Shadows (light mode)

```css
/* Resting */
box-shadow:
  0 0 0 1px var(--foreground-8),
  0 0 20px rgba(0,0,0,0.03),
  0 36px 28px rgba(0,0,0,0.02),
  0 25px 25px rgba(0,0,0,0.02),
  0 15px 15px rgba(0,0,0,0.02),
  inset 0 0 0 1px var(--department-workspace-inset-highlight);

/* Hover */
box-shadow:
  0 0 0 1px var(--foreground-10),
  0 0 24px var(--department-workspace-accent-soft),
  0 36px 28px rgba(0,0,0,0.025),
  inset 0 0 0 1px var(--department-workspace-inset-highlight);
```

#### CTA Button Shadow

```css
box-shadow:
  0 13px 5px rgba(0,0,0,0.03),
  0 7px 4px rgba(0,0,0,0.07),
  0 3px 3px rgba(0,0,0,0.14),
  0 1px 2px rgba(0,0,0,0.19),
  inset 0 1.5px 0 rgba(255,255,255,0.35);
```

#### Icon Shadow (embossed look)

```css
box-shadow:
  0 0.333px 0 rgba(0,0,0,0.2),
  0 0.667px 0.667px var(--white-100),
  0 0 1.333px rgba(0,0,0,0.3);
```

#### Inset Panel Shadows

```css
/* Light mode */
box-shadow:
  inset 0px 0px 0px 1px rgba(0,0,0,0.05),
  inset 0px 2px 2px -1px rgba(0,0,0,0.08);

/* Dark mode */
box-shadow:
  inset 0px 0px 0px 1px rgba(255,255,255,0.08),
  inset 0px -1px 1px 0px rgba(0,0,0,0.45);
```

#### Glass Panel Shadows

```css
/* Glass container */
box-shadow:
  inset 0 1px 1px var(--department-workspace-inset-highlight),
  inset 0 -1px 1px rgba(0,0,0,0.04);

/* Elevated glass */
box-shadow:
  0 26px 64px rgba(0,0,0,0.35);

/* Modal-like */
box-shadow:
  0px 18px 44px rgba(0,0,0,0.42),
  inset 0px 1px 0px rgba(255,255,255,0.48);
```

---

## 12. Animations & Transitions

### Shimmer Effect

```css
@keyframes shimmer {
  0% { background-position: 100% 0; }
  100% { background-position: -160% 0; }
}

.shimmer {
  background: linear-gradient(
    105deg,
    transparent 0%,
    transparent 36%,
    rgba(255, 255, 255, 0.72) 48%,
    transparent 60%,
    transparent 100%
  ) 0% 0% / 260% 100%;
  animation: 5.5s linear infinite shimmer;
}
```

### Transition Patterns

| Pattern | Duration | Easing |
|:--------|:---------|:-------|
| Card hover lift | 150ms | `ease-out` |
| Color transitions | 200ms | `ease-in-out` |
| Box-shadow transitions | 200ms | `ease-out` |
| Chat input shadow | 300ms | `ease-in-out` |
| Toast transforms | 400ms | `ease` |
| Toast opacity | 400ms | linear |
| Button filter/opacity | 200ms | `ease-out` |

### Button Hover Effects

```css
/* All interactive buttons */
transition: filter, opacity, box-shadow 200ms ease-out;
hover: brightness(1.1);
active: brightness(0.95);
disabled: pointer-events-none; opacity: 0.55;
```

### Card Hover Lift

```css
/* Roadmap step cards */
enabled:hover {
  transform: translateY(-1px);
  border-color: var(--foreground-20);
}

/* Browser preview cards */
:hover {
  transform: translateY(-2px); /* -0.5 = -2px */
}
```

### Toast/Notification Animations

```css
/* Entry */
animation: sonner-fade-in 0.3s ease forwards;

/* Exit */
animation: sonner-fade-out 0.2s ease forwards;

/* Swipe variants */
@keyframes swipe-out-up { ... }
@keyframes swipe-out-down { ... }
@keyframes swipe-out-left { ... }
@keyframes swipe-out-right { ... }

/* Loading spinner */
animation: sonner-spin 1.2s linear infinite;
```

---

## 13. Component Patterns

### Roadmap Card (Home view)

```css
.roadmap-card {
  /* Interactive card with gradient background */
  /* Contains: title "Harboreval Roadmap", progress "9%", visual elements */
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0,0,0,0.35);
}
```

### Suggested Task Button

```css
.suggested-task-button {
  font-size: 13px;
  font-weight: 500;
  line-height: 15px;
  color: var(--foreground-80);
}
```

### Department Node Icon (in step cards)

```css
.department-icon {
  width: 28px;
  height: 28px;
  flex-shrink: 0;
  border-radius: 5px;
  border: 1px solid var(--foreground-5);
  background: var(--background-l0);
  color: var(--foreground-55);
  box-shadow:
    0 0 0 1px var(--foreground-8),
    0 0 20px rgba(0,0,0,0.03);
}
```

### Screen Reflectance (Gloss Effect)

Used on the center hub and browser previews:

```css
.screen-reflectance {
  position: absolute;
  background: linear-gradient(
    135deg,
    var(--screen-reflectance-start) 0%,
    var(--screen-reflectance-end) 60%
  );
  clip-path: polygon(0px 0px, 100% 0px, 85% 100%, 0px 100%);
}
```

### Progress Dots

Used in roadmap cards (e.g., "0/3 Setup"):

```css
.progress-dot {
  height: 3px;
  width: 12px;
}
.progress-dot.empty {
  background: var(--foreground-10);
}
.progress-dot.filled {
  background: var(--department-workspace-accent);
}
```

### Resize Handle

Between canvas and panels:
```css
.resize-handle {
  position: absolute;
  top: 0; bottom: 0; left: 0;
  z-index: 50;
  width: 8px; /* w-2 */
  cursor: col-resize;
}
```

---

## 14. Harbor Adaptation Notes

### What to Adopt

1. **Department → Stage metaphor**: Map 8 departments to Harbor's eval pipeline stages
2. **Workspace CSS variable system**: Implement `--stage-accent`, `--stage-accent-soft`, `--stage-glass`, etc.
3. **Tech Tree → Eval Pipeline**: Build a similar progression view for eval design stages
4. **Browser preview cards**: Adapt for eval preview thumbnails
5. **Shimmer animation**: Use on loading/pending states
6. **Shadow depth system**: Adopt the multi-layer shadow recipes
7. **Foreground opacity scale**: Implement full `foreground-{5..100}` system
8. **Agent config panel**: Adapt for stage configuration
9. **Chat panel**: Already have companion; add context-switching badges

### What to Modify

1. **Color system**: Use Harbor's purple (`#7c5cfc`) as primary accent instead of neutral
2. **Background**: Warm our dark bg from `#09090b` to `#0d0d11` (matching Cofounder's warmth)
3. **Canvas type**: We don't need React Flow (no drag nodes) — use CSS grid stages instead
4. **Bottom tabs**: Simplify to match our stage-driven flow
5. **Department accents**: Create eval-stage-specific accent palette
6. **Traffic light dots**: Skip macOS chrome — not our aesthetic

### Priority Implementation Order

1. CSS variable system (`foreground-{N}`, `background-l{N}`)
2. Shadow recipes (outset, inset, glass, CTA)
3. Shimmer animation
4. Card patterns (roadmap step, suggested task)
5. Tab navigation with sliding indicator
6. Companion chat styling (badge, input, backdrop-blur)
7. Accent color per-stage system
8. Screen reflectance gloss effect

---

*This audit was extracted from the live Cofounder.co product using DOM inspection,
HTML parsing, CSS extraction, and pixel sampling. All values are production-accurate.*
