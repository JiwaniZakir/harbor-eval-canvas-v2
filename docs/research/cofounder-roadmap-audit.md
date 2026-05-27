# Cofounder.co Roadmap System - Deep Audit

**Date:** 2026-05-24
**Method:** Live interaction with `app.cofounder.co/org/harboreval-8387fb/canvas`

---

## 1. Architecture Overview

The roadmap is NOT a separate page. It is **embedded directly into each department's workspace plate node** on the React Flow canvas. Each department node contains:

1. **Department Node** (small clickable label, e.g. "Operations") - the octagonal layout ring
2. **Workspace Plate Node** (large expanded panel) - the detailed workspace for that department
3. **Workspace Home Node** (mini dashboard) - compact view with tabs

The roadmap appears as a **horizontal strip at the bottom of each workspace plate**, with step cards scrolling left-to-right.

### Canvas Node Types Observed
```
departmentNode              - Small label node in octagonal ring
departmentWorkspacePlateNode - Large workspace panel (contains roadmap)
departmentWorkspaceHomeNode  - Compact home dashboard
```

### Workspace Modes (per department)
Each workspace can be in one of three modes:
- `roadmap` - Shows the tech tree roadmap strip (Operations, Engineering, Design)
- `pipeline` - Shows a sales-style pipeline view (Sales)
- `composer` - Shows a content composition view (Marketing)

## 2. Roadmap Strip Structure

### Layout
- Horizontal scrollable strip at the workspace plate bottom
- Step cards are 248px wide x 72px tall
- Cards connected by dashed line connectors (43px wide)
- Connector has a centered icon (lock for locked, checkmark for completed)
- Cards have a 48px square icon on the left, title + subtitle on the right

### Step Card Anatomy
```
┌─────────────────────────────────────────────────────┐
│  ┌──────┐                                    [🔒]  │
│  │ ICON │  Title (13px, font-medium)                │
│  │ 48px │  Subtitle (11px, text-foreground-50)      │
│  └──────┘                                           │
│                                                     │
└─────────────────────────────────────────────────────┘
  Width: 248px | Height: 72px | rounded-[12px]
  Background: bg-background-screen
  Border: conditional on status
  Box-shadow: complex layered (outset-025 + accent ring for active)
```

### Icon System
Icons are loaded from `/tech-tree-icons/` as SVG masks:
```css
mask-image: url("/tech-tree-icons/{icon-name}.svg");
background-color: var(--foreground-50);
```

Observed icons:
- `setup` - Generic setup tasks
- `launch-outline` - Launch/deployment milestones
- `domain-outline` - Domain purchase
- `search-outline` - SEO, prospect gathering
- `auth-users-outline` - Authentication
- `brand-outline` - Brand identity
- `social-outline` - Social media
- `code-outline` - Code/development
- `code-advanced-light` - Advanced code (completed tasks)
- `seedling-advanced-light` - Growth/positioning tasks
- `mail` - Email setup

### Connector Between Steps
```
 [Card 1] ───── · ─────── [Card 2]
              [🔒/✓]

- Width: 43px, height: 1px (h-1 w-[43px])
- Dashed border: border-dashed border-foreground-30
- Center icon: 16x16px, rounded-[4px], bg-background-l100
- Icon shadow: complex multi-layer matching card shadows
```

## 3. Step Card Statuses

### Status Values (from data attributes)
| Status | Subtitle Text | Visual Treatment |
|--------|--------------|------------------|
| `available` | "Needs your input" or "Provision resource" | Active border, full opacity |
| `in_progress` | "In progress" | Accent ring (2px), active glow, shimmer overlay |
| `locked` | "Needs earlier steps first" | Dimmed (opacity: 0.72), lock icon in connector, lock badge top-right |
| `completed` | "Completed" | Checkmark icon, green tint |

### Visual Treatment per Status

**Available:**
```css
border-foreground-15
enabled:hover:-translate-y-px
enabled:hover:border-foreground-20
/* No lock badge, normal opacity */
```

**In Progress:**
```css
border-foreground-15
box-shadow: var(--shadow-outset-025),
  0 0 0 2px var(--department-workspace-accent-soft),
  0 0 0 1px var(--foreground-20),
  inset 0 0 0 1px var(--white-100);
/* Shimmer overlay on the card */
```

**Locked:**
```css
border-foreground-8
opacity: 0.72
/* Lock badge (16x16px) top-right corner */
/* Lock SVG icon inside badge */
```

**Completed:**
```css
/* Green checkmark replaces lock badge */
/* Icon uses code-advanced-light variant */
```

## 4. Roadmap Progress Indicator

Each roadmap strip has a header showing:
```
{Department} Roadmap                    {N}/{Total} Setup  [■■■□□□□□]

- Label: font-mono text-xs text-foreground-70
- Progress: text-foreground-80, gap-[14px] text-xs
- Progress bars: h-[3px] w-3 segments
  - Filled: bg-foreground-80 (or domain accent for in_progress)
  - Empty: bg-foreground-10
```

Global progress shown on the "Open Roadmap" button:
- `aria-label="Open harboreval roadmap, 11% complete"`
- Percentage updates as steps are completed

## 5. Complete Roadmap Per Department

### Operations Roadmap (2 steps)
| # | KEY | Title | Status | Icon |
|---|-----|-------|--------|------|
| 1 | BANK | Open bank account | available | setup |
| 2 | BOOKKEEPING | Setup bookkeeping | locked | setup |

### Engineering Roadmap (7 steps)
| # | KEY | Title | Status | Icon |
|---|-----|-------|--------|------|
| 1 | WEBSITE | Build marketing website | in_progress | setup |
| 2 | LAUNCH_SITE | Marketing website is launched | locked | launch-outline |
| 3 | LAUNCH_PROD | Product app is launched | locked | launch-outline |
| 4 | DOMAIN | Buy domain | available | domain-outline |
| 5 | SEO | Optimize SEO | locked | search-outline |
| 6 | AUTH | Add auth | locked | auth-users-outline |
| 7 | STRIPE | Billing is approved and connected | locked | setup |

### Design Roadmap (1 step visible)
| # | KEY | Title | Status | Icon |
|---|-----|-------|--------|------|
| 1 | BRAND | Brand identity | in_progress | brand-outline |

### Marketing Roadmap (4 steps)
| # | KEY | Title | Status | Icon |
|---|-----|-------|--------|------|
| 1 | CODEBASE | Product repository foundation exists | completed | code-advanced-light |
| 2 | SOCIAL | Setup social presence | available | social-outline |
| 3 | SOCIAL_ACCOUNTS_CONNECT | Connect social accounts | locked | social-outline |
| 4 | SOCIAL_GROW | Grow social presence | locked | social-outline |

### Sales Roadmap (7 steps)
| # | KEY | Title | Status | Icon |
|---|-----|-------|--------|------|
| 1 | POSITIONING | Define positioning | in_progress | seedling-advanced-light |
| 2 | PROSPECTS | Gather prospects | locked | search-outline |
| 3 | EMAIL | Setup outbound email | locked | mail |
| 4 | OUTREACH | Send cold outreach | locked | setup |
| 5 | OPPORTUNITIES | Qualify opportunities | locked | setup |
| 6 | DEALS | Close deals | locked | setup |
| 7 | ONBOARD | Onboard accounts | locked | setup |

## 6. Cross-Department Dependencies

Steps reference the "tech tree" - a dependency graph where some steps in one department unlock steps in another. Evidence:

- Design's BRAND step appears in both Design and Marketing roadmaps
- Engineering's WEBSITE step appears in both Engineering and Marketing roadmaps
- Marketing's CODEBASE (completed) unlocks further Engineering steps

The `data-ph-capture-attribute-tech-tree-node-key` attribute is the shared key across departments.

## 7. "Suggested Next" Section

Below the task list in the chat panel, there is a **"Suggested Next"** section:
```
SUGGESTED NEXT              [↻ Refresh]
  ○ App is built              [Start]
  ○ Setup social presence     [Mark complete]
  ○ Open bank account         [Mark complete]
```

- Each suggestion is a 32px-tall row
- Circle indicator: 10x10px SVG, dashed stroke (stroke-dasharray: 2.4 2.8), stroke-foreground-30
- Hover reveals action buttons ("Start" or "Mark complete")
- "Start" button appears for tasks that need agent work
- "Mark complete" button appears for manual/external tasks
- Refresh button regenerates suggestions

Each suggestion includes a tooltip description explaining WHY it's suggested:
- "App is built - Completing this milestone opens the next branch of the company path."
- "Setup social presence - Establishing LinkedIn and X profiles early lets you start building an audience before you have a product."
- "Open bank account - A dedicated business bank account separates personal and company finances."

## 8. "View Full Roadmap" Button

Located in the Sales department workspace plate:
```
Button: "View Full Roadmap"
Classes: relative inline-flex items-center justify-center
  rounded-[8px] shadow-button-md h-8 px-3 text-[12px] font-medium
Background: linear-gradient(0deg, var(--white-5), var(--white-5)),
  var(--background-sidepanel)
```

Clicking opens the tech tree overlay/panel (URL gains `?open_tech_tree=1`).

## 9. Key CSS Variables Used in Roadmap

```css
--department-workspace-accent: #4087f2       /* Department color */
--department-workspace-accent-soft: rgba(64,135,242,0.18)
--department-workspace-inset-highlight: white /* Inner reflection */
--department-workspace-raised              /* Elevated surface bg */
--department-workspace-primary-bg          /* Primary button bg */
--department-workspace-primary-border      /* Primary button border */
--department-workspace-primary-hover       /* Primary button hover */
--department-workspace-primary-text        /* Primary button text */

--shadow-outset-025                        /* Base card shadow */
--background-screen                        /* Card background */
--background-screen-high-contrast          /* Icon container bg */
--background-l100                          /* Badge/connector bg */
--background-l150                          /* Elevated content bg */
--background-l-negative-50                 /* Workspace plate bg */
--background-l200-90                       /* Composer bg */

--foreground-5 through --foreground-90     /* Text opacity scale */
--white-100                                /* White for light insets */
```

## 10. Key Architectural Patterns

1. **Roadmap steps are "tech tree nodes"** - shared across departments via a global key system (BANK, WEBSITE, BRAND, etc.)
2. **Steps have dependency chains** - locked status driven by prerequisite completion
3. **Steps can appear in multiple department roadmaps** (cross-references)
4. **Progress is global** - 11% shown at org level, not per-department
5. **Three workspace modes** per department: roadmap, pipeline, composer
6. **"Suggested Next" is AI-generated** - refreshable suggestions with explanatory tooltips
7. **Steps can be manually marked complete** (for external tasks like "Open bank account")
8. **Steps can be auto-completed by agents** (for agent-executable tasks like "Build marketing website")
