# Cofounder.co Agent Orchestration & Component Architecture Audit

> Deep interaction audit of the live product at `app.cofounder.co/org/harboreval-8387fb/canvas`
> Date: 2025-01-24 | All interactions performed live, tasks executed on real agents

---

## Table of Contents

1. [Canvas Circle Architecture](#1-canvas-circle-architecture)
2. [Department Node States & Transitions](#2-department-node-states)
3. [Agent Launch & Activation Flow](#3-agent-launch-flow)
4. [Task Lifecycle (End-to-End)](#4-task-lifecycle)
5. [Agent Orchestration System](#5-agent-orchestration)
6. [Right-Hand Chat Panel Behavior](#6-chat-panel-behavior)
7. [Department Agent Configurations](#7-department-agent-configs)
8. [Tech Tree / Roadmap Integration](#8-tech-tree-integration)
9. [Navigation & View System](#9-navigation-system)
10. [Create Menu & Agent Creation](#10-create-menu)
11. [Inbox & Notification System](#11-inbox-notifications)
12. [Engineering Workspace (Special)](#12-engineering-workspace)
13. [Cross-Department Interactions](#13-cross-department)
14. [Complete State Machine](#14-state-machine)

---

## 1. Canvas Circle Architecture

### Octagonal Hub Layout

The 8 department agents are arranged in an **octagonal pattern** around a central Cofounder hub node, implemented as a React Flow canvas:

```
                    Support (474, 148)
                   ╱                  ╲
        Sales (284, 227)      Operations (664, 227)
           │                              │
  Marketing (205, 418) ── [CENTER] ── Finance (743, 418)
           │            (495, 416)        │
      Design (284, 608)        Legal (664, 608)
                   ╲                  ╱
                Engineering (474, 687)
```

### Z-Index Layering

| Layer | Z-Index | Content |
|:------|:--------|:--------|
| Background plates | 0 | `dept-workspace-plate-{uuid}` - decorative backing |
| Workspace panels | 1 | `dept-workspace-home-{uuid}` - active department content |
| Department nodes | 50 | Small labeled cards (95.9×30px) |
| Center hub | 60 | Cofounder sunflower icon node |

### Three Types of Department States on Canvas

#### 1. Not Setup (Support, Finance, Legal)
- Small card node only, no workspace panel
- Card shows just the department name in `text-foreground-60`
- `department-not-setup-glow` effect: subtle outer glow ring
- No accent color applied (uses default foreground tinting)

#### 2. Setup But Idle (Operations pre-launch)
- Workspace panel visible behind the node card
- Shows department description and CTA button
- Panel structure:
  ```
  ┌─────────────────────────────────┐
  │ {Dept} Department               │
  │ {Dept} agent ready              │
  │                                 │
  │ {Tagline}                       │
  │ {Sub-tagline}                   │
  │                                 │
  │ [Launch/Mark complete →]        │
  │                                 │
  │ {Dept} Roadmap  0/N Setup ■■■■  │
  │ ├── Task 1  (status)            │
  │ ├── Task 2  (status)            │
  │ └── Task 3  (status)            │
  └─────────────────────────────────┘
  ```

#### 3. Active (Running Tasks)
- Workspace panel visible with active state indicators
- Node card shows: **"N Running: N"** or **"N Ready to review: N"**
- Department accent color fully applied
- Roadmap items update to show "In progress" states

### Department Taglines

| Department | Tagline |
|:-----------|:--------|
| Operations | "Handle every moving piece of your business" |
| Engineering | (Projects/Stack/Database/Launches view) |
| Design | "Create the next brand artifact" |
| Marketing | "Tell me who and how you sound. I'll make the first content." |
| Sales | (Shows roadmap immediately) |

---

## 2. Department Node States

### Node Card Visual States

```
┌────────────────────────────────────────���────┐
│ DEFAULT (idle)                              │
│ ┌──────────────┐                            │
│ │  Operations  │  text-foreground-60        │
│ └──────────────┘  bg-background-l50         │
│                   shadow-inset-200           │
├─────────────────────────────────────────────┤
│ RUNNING (task active)                       │
│ ┌──────────────────┐                        │
│ │ 2                │  Badge count appears    │
│ │ Running: 2       │  Status text below      │
│ │ Engineering      │  Accent color active    │
│ └──────────────────┘                        │
├─────────────────────────────────────────────┤
│ READY TO REVIEW (task completed)            │
│ ┌────────────────────────┐                  │
│ │ 1                      │  Badge count      │
│ │ Ready to review: 1     │  Review indicator  │
│ │ Sales                  │  Accent active     │
│ └────────────────────────┘                  │
├───────────────────────────��─────────────────┤
│ NOT SETUP (no agent launched)               │
│ ┌──────────────┐                            │
│ │  Support     │  Dimmed appearance          │
│ └──────────────┘  glow-effect on hover       │
│                   No workspace panel         │
└─────────────────────────────────────────────┘
```

### Workspace Panel Activation States

| State | CTA Button | Roadmap Status | Agent Accessible? |
|:------|:-----------|:---------------|:------------------|
| Not setup | N/A (no panel) | N/A | No |
| Ready to setup | "Launch {Dept} Agent →" | "0/N Setup" | No |
| Setup complete | "Mark complete →" | "0/N Setup" | Yes |
| Active (running) | "Check status" | "In progress" items | Yes |
| Ready to review | "Review" | "Needs approval" items | Yes |

---

## 3. Agent Launch & Activation Flow

### The Launch Sequence

When clicking **"Launch {Department} Agent"**:

```
1. Click "Launch Sales Agent" button
   │
2. URL updates: canvas → canvas?session={uuid}&tab=taskAgents
   │
3. View transitions to Agent Task View:
   ┌──────────────────────────────────────────────────┐
   │ Top bar:  harboreval > Sales > Sales Agent       │
   │           > Define positioning                    │
   ├──────────────────────────────────────────────────┤
   │ Left/Center: Agent Workspace                     │
   │   Timer: 0m 0s                                   │
   │   Status: "Creating"                              │
   │   Artifact: "Positioning — Harbor Eval Studio"    │
   │   Tabs: [Preview] [Source]                        │
   │   "Select text and leave comments to edit"        │
   │   "0 pending requests · 1 artifact"               │
   ├──────────────────────────────────────────────────┤
   │ Right Panel: Chat with {Dept} Agent              │
   │   Badge: "Sales Agent" (was "Cofounder")          │
   │   Task: "Define positioning"                      │
   │   Placeholder: "Ask for any changes and use       │
   │     @ to add context from other departments..."   │
   │   Button: [Stop] (not Submit - agent running)     │
   │   Status: "Sales positioning is ready started"    │
   └──────────────────────────────────────────────────┘
   │
4. Canvas node updates: "Running: 1" badge appears
   │
5. Agent auto-starts first roadmap task
   │
6. Agent streams output (artifacts created in real-time)
   │
7. On completion: "Running: 1" → "Ready to review: 1"
   │
8. Inbox: "N agent updates" notification appears
   │
9. Roadmap progress % increases (9% → 11%)
```

### Key Behavioral Rules

1. **Auto-task assignment**: Launching an agent automatically starts its first roadmap task (e.g., Sales → "Define positioning", Design → "Brand Identity", Engineering → "Build marketing website MVP")
2. **No manual task selection on first launch**: The system picks the right task from the roadmap
3. **Session tracking**: Each agent launch creates a unique session UUID
4. **URL parameters**: `?session={uuid}&tab=taskAgents` tracks active context
5. **Multiple concurrent agents**: Engineering was "Running: 2" and Design "Running: 1" simultaneously

---

## 4. Task Lifecycle (End-to-End)

### Task States

```
                    ┌─────────────┐
                    │  Available  │  (user can start)
                    └──────┬──────┘
                           │ Click "Start" / Agent auto-assigns
                    ┌──────▼──────┐
                    │   Running   │  Timer counting, [Stop] button
                    │  "Creating" │  Artifacts being generated
                    └──────┬──────┘
                           │ Agent completes
                    ┌──────▼──────┐
                    │   Review    │  "Ready to review: 1"
                    │  "Needs     │  Inbox notification
                    │  approval"  │  
                    └──────┬──────┘
                           │ User approves
                    ┌──────▼──────┐
                    │  Completed  │  Roadmap progress increases
                    └─────────────┘
```

### Task States in Roadmap Cards

| State | Display Text | Visual | Interactable? |
|:------|:-------------|:-------|:-------------|
| Available | "Complete task" | Normal card | Yes - click to start |
| Needs your input | "Needs your input" | Input indicator | Yes - user provides info |
| Needs earlier steps | "Needs earlier steps first" + 🔒 | Greyed + lock icon | No |
| In progress | "In progress" | Active accent color | Yes - view status |
| Needs approval | "Needs approval" | Review badge | Yes - approve/reject |
| Completed | "Completed" | Checkmark, filled | No action needed |
| Provision resource | "Provision resource" | System action | System-managed |

### Agent Workspace During Task Execution

```
┌─────────────────────────────────────────┐
│ Agent Workspace                         │
│ Timer: 2m 22s                           │
├─────────────────────────────────────────┤
│ ┌─ Artifact ────────────────────────┐   │
│ │ Positioning — Harbor Eval Studio  │   │
│ │ Status: Creating                  │   │
│ │ [Preview] [Source]                │   │
│ ├───────────────────────────────────┤   │
│ │ "Select text and leave comments   │   │
│ │  to edit"                         │   │
│ │                                   │   │
│ │ [Full artifact content renders    │   │
│ │  here in real-time as agent       │   │
│ │  streams its output]              │   │
│ │                                   │   │
│ │ e.g., competitive analysis:       │   │
│ │ - Promptfoo: CLI-first...         │   │
│ │ - Giskard: EU guardrails...       │   │
│ │ - Haize Labs: SOC2, services...   │   │
│ │ - Braintrust: LLM eval...        │   │
│ │ Source: braintrust.dev/...        │   │
│ └───────────────────────────────────┘   │
│ 0 pending requests · 1 artifact         │
└─────────────────────────────────────────┘
```

### Artifact Types Observed

| Artifact | Department | Description |
|:---------|:-----------|:------------|
| Positioning document | Sales | Competitive analysis + messaging angles |
| Sales Messaging Angles | Sales | Buyer personas + pitch language |
| Brand Identity | Design | Brand guidelines + visual identity |
| Marketing website MVP | Engineering | Actual code deployment |

### Artifact Tabs

- **Preview**: Live rendered preview of the artifact (interactive, selectable text)
- **Source**: Raw source/code view

---

## 5. Agent Orchestration System

### How Multi-Agent Coordination Works

```
┌──────────────────────────────────────────────────────────┐
│                    COFOUNDER (Central AI)                 │
│                                                          │
│  Orchestrates the overall company-building roadmap.      │
│  Suggests next tasks. Routes work to departments.        │
│  Always available in the chat panel.                      │
│                                                          │
│  When user asks a question → Cofounder answers           │
│  When user launches dept → auto-assigns first task       │
│  When task completes → notifies via inbox                │
│  When all dept tasks done → advances roadmap stage       │
└────────────┬───────────────────────────────┬─────────────┘
             │                               │
    ┌────────▼──────────┐          ┌────���───▼──────────┐
    │   Sales Agent     │          │  Design Agent     │
    │                   │          │                   │
    │ Tasks:            │          │ Tasks:            │
    │ - Define pos. ✓   │          │ - Brand identity ✓│
    │ - Gather prospects│          │ - Pitch deck      │
    │ - Setup outbound  │          │ - Email templates │
    │ - Send cold       │          │ - UI kit          │
    │ - Qualify opps    │          │                   │
    │ - Close deals     │          │                   │
    │ - Onboard accts   │          │                   │
    └───────────────────┘          └───────────────────┘
```

### Agent Context Switching

When you navigate to a department:
1. **Top breadcrumb** updates: `harboreval > {Dept} > {Agent Name} > {Task}`
2. **Chat badge** switches from "Cofounder" to "{Dept} Agent"
3. **Chat placeholder** changes to task-specific: "Ask for any changes and use @ to add context from other departments..."
4. **Chat submit button** becomes "Stop" during active execution
5. **Canvas highlights** the active department node

When you navigate back to Home:
1. Breadcrumb resets to just `harboreval`
2. Chat badge resets to "Cofounder"
3. Chat placeholder resets to "Ask Cofounder anything about your company..."
4. Submit button returns to normal

### Cross-Department References

The chat input supports **@ mentions** for cross-department context:
```
"Ask for any changes and use @ to add context from other departments..."
```
This allows tasks to reference outputs from other department agents (e.g., Sales can reference Design's brand identity when crafting positioning).

### Concurrent Execution

Multiple departments can have agents running simultaneously:
- Engineering: "Running: 2" (building marketing website + app)
- Design: "Running: 1" (brand identity)
- Sales: completed ("Ready to review: 1")

The system manages parallel execution without conflicts.

---

## 6. Right-Hand Chat Panel Behavior

### Chat Panel States

```
STATE 1: HOME (Default)
┌─────────────────────────┐
│ [Cofounder] badge       │  ← bg-[linear-gradient(180deg,...)]
│                         │
│ Ask Cofounder anything  │  ← placeholder
│ about your company...   │
│                         │
│ [📎] [Submit]           │  ← actions
└─────────────────────────┘

STATE 2: DEPARTMENT AGENT (Active Task)
┌─────────────────────────┐
│ [Sales Agent] badge     │  ← badge changes to agent name
│                         │
│ Define positioning      │  ← task context shown
│                         │
│ Ask for any changes     │  ← task-specific placeholder
│ and use @ to add        │
│ context from other      │
│ departments...          │
│                         │
│ [📎] [Stop]             │  ← Stop replaces Submit
│                         │
│ "Sales positioning is   │  ← status message
│  ready started"         │
└─────────────────────────┘

STATE 3: DEPARTMENT AGENT (Idle - viewing config)
┌─────────────────────────┐
│ [Cofounder] badge       │  ← stays Cofounder when viewing
│                         │     agent config (not task)
│ Ask Cofounder anything  │
│ about your company...   │
│                         │
│ [📎] [Submit]           │
└─────────────────────────┘
```

### Badge Styling

```css
/* Light mode badge */
.agent-badge {
  display: inline-flex;
  height: 28px;
  align-items: center;
  gap: 6px;
  border-radius: 6px;
  padding: 0 8px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  background: linear-gradient(180deg, #EFEFEC 0%, rgba(239,239,236,0.50) 100%);
}

/* Dark mode badge */
.agent-badge.dark {
  background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.015) 100%);
}
```

### Input Container Styling

```css
.chat-input-container {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  padding: 12px;
  border: 1px solid var(--foreground-10);
  backdrop-filter: blur(12px);
  border-radius: 8px;
  background: var(--background-l200-90);
  transition: box-shadow 300ms ease-in-out;
}

/* Dark mode shadow */
.chat-input-container.dark {
  box-shadow: 0 8px 24px rgba(0,0,0,0.5);
}
```

---

## 7. Department Agent Configurations

### Operations - Ops Agent

| Property | Value |
|:---------|:------|
| Agent Name | Ops Agent |
| Type | Default |
| Model | Claude Sonnet 4.6 |
| Accent | `#B16A27` (warm amber) |
| Skills | ops-agent-skills |
| Integrations (13) | Metabase, Spreadsheet, Gmail, Agentmail, Slack, Notion, Airtable, Attio, +5 more |
| Deletable? | No ("Default agents cannot be deleted") |

**System Prompt Summary** (10 rules):
1. Identify available workspace systems
2. Prefer managed/connected integrations first
3. Read before writing - gather before proposing
4. Clear boundary: Finance owns payments/refunds; Ops owns prep/reconciliation
5. Exception-first output: unreconciled receipts, mismatches
6. Durable artifacts over one-off chat replies
7. Shape repeating tasks into reusable flows
8. Safe write actions, deliberate high-risk ones
9. Use best available system of record
10. Browser tools only when materially helpful

**Workflow Starters:**
- Start reconciliation queue
- Daily ops brief
- Cross-system cleanup

**Accordion Sections:**
1. Suggested Next (workflow starters)
2. Tasks (task list)
3. Routines (scheduled/recurring)
4. Agent Context (system prompt, badge count)
5. Model + Skills (model selector + custom skills)
6. Integrations (connected services)
7. Danger Zone (delete agent)

### Sales - Sales Agent

| Property | Value |
|:---------|:------|
| Agent Name | Sales Agent |
| Accent | `#80A740` (green) |
| Auto-started task | "Define positioning" |
| Roadmap | 7 steps: Define positioning → Gather prospects → Setup outbound → Send cold → Qualify → Close → Onboard |
| Workspace tabs | Home, CRM, Inbox |

**Sales Workspace Special Features:**
- CRM tab (customer relationship management)
- Inbox tab (email/communication)
- "View Full Roadmap" button

### Engineering - Engineer

| Property | Value |
|:---------|:------|
| Agent Name | Engineer |
| Accent | `#4087F2` (blue) |
| Auto-started tasks | "Build marketing website MVP", + 1 more |
| Roadmap | 8 steps: Build app → Build marketing website → Launch marketing → Launch app → Buy domain → SEO → Auth → Billing |

**Engineering Workspace Special Features:**
- **4 workspace view tabs**: Projects, Stack, Database, Launches
- Browser preview cards with deployment URLs:
  - `staging.harboreval-8387fb.cofounder.company`
  - `harboreval-8387fb.cofounder.company`
  - `staging.app.harboreval-8387fb.cofounder.company`
  - `app.harboreval-8387fb.cofounder.company`
- "Your projects. Builds appear here as soon as they exist. Launch when the build is ready."
- "2 projects / 1 live"

### Design - Design Agent

| Property | Value |
|:---------|:------|
| Agent Name | Design Agent |
| Accent | `#8A72E5` (purple) |
| Auto-started task | "Brand Identity" |
| Roadmap | 3+ steps: Brand identity → Pitch deck → Email templates → UI kit |

### Marketing - Marketing Agent

| Property | Value |
|:---------|:------|
| Agent Name | Marketing Agent |
| Accent | `#F46746` (red-orange) |
| Tagline | "Solo technical founders, post-launch but still shaping repeatable demand." |
| Roadmap | 8 steps: Brand identity → Build marketing app → Social presence → Grow social → + more |

**Marketing Roadmap Items Observed:**
- Brand identity (shared with Design)
- Build marketing app
- Setup Social Presence ("Needs your input")
- Grow Social Presence ("Needs earlier steps first")
- Product repository foundation exists ("Completed")
- Connect social accounts ("Needs earlier steps first")

### Support, Finance, Legal

These departments are **not yet setup** - they show only as small cards on the canvas without workspace panels. They would presumably follow the same pattern once launched.

---

## 8. Tech Tree / Roadmap Integration

### Tech Tree Overlay

Triggered by: `?open_tech_tree=1`

Entry points:
- Click "Harboreval Roadmap" card
- Click any suggested task
- Click department roadmap titles
- Click "Mark complete" on workspace panels

### Stage Progression

```
BUILD STAGE     0/8   →  Foundation building
LAUNCH STAGE    0/4   →  Go live
SCALE STAGE     0/7   →  Growth & optimization
```

### Roadmap Progress Tracking

- Starts at **9%**
- After Sales task completed: **11%**
- Progress calculated across all department roadmaps

### Tech Tree Node States After Task Execution

Before:
```
Define positioning: "Complete task" (available)
```

After Sales Agent completed:
```
Define positioning: "Needs approval" (review required)
  WHAT BECOMES TRUE: "The product has clear language for who it serves"
  HOW TO MOVE FORWARD: "Create and approve the company's sales positioning document"
  TO COMPLETE: "Create positioning" / "Done"
```

### Roadmap Step Card Interactions

Each step card shows:
- Task name
- Current status
- "Agent can do this" label (for auto-assignable tasks)
- Lock icon for blocked tasks
- Status change on hover: `translateY(-1px)` + border darkening

---

## 9. Navigation & View System

### View Hierarchy

```
Canvas (Home)
├── Home tab → Welcome + Roadmap card + Suggested tasks + Completed tasks
├── Cofounder tab → Chat focus
├── Company tab → Stack settings + deployment links + agent list
├── Tasks tab → Opens most recent agent detail
└── Library tab → Knowledge base
```

### Breadcrumb Navigation

```
Level 0: harboreval                          (canvas home)
Level 1: harboreval > Sales                  (department)
Level 2: harboreval > Sales > Sales Agent    (agent detail)
Level 3: harboreval > Sales > Sales Agent > Define positioning  (task)
```

Each breadcrumb segment is clickable to navigate up.

### Home View Structure

```
┌─────────────────────────────────────────┐
│ Good evening, Zakir                     │
│                                         │
│ ┌── Harboreval Roadmap ──────────── 11% │
│ │   (Gradient background card)          │
│ └───────────────────────────────────────┘│
│                                         │
│ Tasks                                   │
│ ┌─ Build marketing website MVP ──── 4m ─┐
│ ┌─ Brand Identity ──────────────── 4m ─┐│
│ ┌─ Define positioning ────────── 25m ──┐│
│                                         │
│ Suggested Next                          │
│ [Refresh suggestions]                   │
│ ┌─ App is built ───────────────────────┐│
│ ┌─ Setup social presence ──────────────┐│
│ ┌─ Open bank account ─────────────────┐│
│                                         │
│ Archived Tasks                          │
│ No archived tasks                       │
└─────────────────────────────────────────┘
```

### Task Cards in Home View

```css
.task-card {
  font-size: 13px;
  font-weight: 500;
  line-height: 15px;
  color: var(--foreground-80);
  /* Clickable - navigates to task detail */
  /* Shows elapsed time on right (e.g., "4m", "25m") */
}
```

---

## 10. Create Menu & Agent Creation

### Create Menu (+ Button)

The create button is a **34×34px** circle at the bottom center of the screen:

```css
.create-button {
  width: 34px;
  height: 34px;
  border-radius: 8px;
  color: var(--foreground-inverse-90);
  transition: opacity 150ms, transform 150ms;
  box-shadow: var(--shadow-outset-200);
}
.create-button:hover { opacity: 0.9; }
.create-button:active { transform: scale(0.95); }
```

### Menu Items

| Item | Description | Action |
|:-----|:------------|:-------|
| **New Agent** | "Employee you can give tasks to" | Opens department selector |
| **New Task** | "Work to assign your agents" | Opens task creation in active department |

### New Agent Flow

After clicking "New Agent":
1. Department selector buttons appear: [Engineering] [Design] [Sales] [Marketing]
2. Only active (launched) departments are shown as options
3. Clicking a department creates a new custom agent under that department

### Menu Item Styling

```css
.create-menu-item {
  font-size: 14px;
  font-weight: 500;
  line-height: 16px;
  color: var(--foreground-inverse-90);
}
.create-menu-description {
  font-size: 12px;
  color: var(--foreground-inverse-60);
}
```

---

## 11. Inbox & Notification System

### Inbox Button States

```
No updates:    [Open inbox]
With updates:  [Open recent updates. 2 items.] + [2 agent updates]
```

### Notification Flow

1. Agent completes a task
2. Department node badge: "Ready to review: N"
3. Top bar inbox: "N agent updates" with count badge
4. The `attention-interactive-surface` class adds visual attention cue
5. Clicking notification navigates to the completed task

### Inbox Styling

```css
.attention-inbox-shell {
  /* Contains the notification badge and action */
}
.attention-interactive-surface {
  /* Pulsing/attention-drawing surface */
}
```

---

## 12. Engineering Workspace (Special)

The Engineering department has a unique workspace with **4 tabbed views**:

### Workspace Tabs

| Tab | Content |
|:----|:--------|
| **Projects** | Active projects with build status |
| **Stack** | Technology stack configuration |
| **Database** | Database schema/management |
| **Launches** | Deployment and launch management |

### Project Cards

```
Your projects.
Builds appear here as soon as they exist.
Launch when the build is ready.

2 projects / 1 live
```

Each project shows:
- **Build status**: "Build pending View" / "Build after first run Start"
- **Live status**: "Live after launch Launch"
- **Deployment URLs** with "Open" links:
  - staging.harboreval-8387fb.cofounder.company
  - harboreval-8387fb.cofounder.company
  - staging.app.harboreval-8387fb.cofounder.company
  - app.harboreval-8387fb.cofounder.company

### Browser Preview Cards (in workspace)

Each deployment gets a miniature browser window showing:
- Traffic light dots (close/minimize/maximize)
- URL bar with domain
- Shimmer animation on glass panels
- Hover: translateY(-2px) + accent glow shadow

---

## 13. Cross-Department Interactions

### How Departments Reference Each Other

1. **@ mentions in chat**: Use `@` to add context from other departments
2. **Shared roadmap items**: "Brand identity" appears in both Design and Marketing roadmaps
3. **Dependency chains**: Sales "Gather prospects" needs Sales "Define positioning" first
4. **Cross-department handoffs**: Ops system prompt says "produce requirements, acceptance criteria, and handoff notes for Engineer"
5. **Tech Tree dependencies**: "Marketing website is launched" needs "Build marketing website" from Engineering

### Task Dependency Resolution

```
Engineering: "Build marketing website" → IN PROGRESS
Marketing: "Marketing website is launched" → "Needs earlier steps first" 🔒
Engineering: "Product app is launched" → "Needs earlier steps first" 🔒
Sales: "Gather prospects" → "Needs earlier steps first" 🔒
  └── Depends on: Sales "Define positioning" → "Needs approval" (review)
```

### Agent-to-Agent Communication

The Cofounder central AI acts as **orchestrator**:
- Routes tasks to appropriate department agents
- Manages cross-department dependencies
- Provides the "Suggested Next" recommendations
- Tracks overall roadmap progress
- Notifies when tasks need review

---

## 14. Complete State Machine

### Department Lifecycle

```
┌─────────────┐     Launch Agent      ┌──────────────┐
│  NOT SETUP  │ ─────────────────────▶ │ AGENT SETUP  │
│  (card only)│                        │ (auto-task)  │
└─────────────┘                        └──────┬───────┘
                                              │
                                    Auto-assigns first task
                                              │
                                       ┌──────▼───────┐
                                       │   RUNNING    │
                                       │ "Running: N" │
                                       └──────┬───────┘
                                              │
                                       Task completes
                                              │
                                       ┌──────▼───────┐
                                       │   REVIEW     │
                                       │ "Ready to    │
                                       │  review: N"  │
                                       └──────┬───────┘
                                              │
                                       User approves
                                              │
                                       ┌──────▼───────┐
                                       │  COMPLETED   │
                                       │ (next task   │
                                       │  available)  │
                                       └──────┬───────┘
                                              │
                                       Start next task
                                              │
                                       ┌──────▼───────┐
                                       │   RUNNING    │
                                       │  (cycle)     │
                                       └──────────────┘
```

### Canvas State After Full Exploration

```
Support:     NOT SETUP (card only)
Operations:  SETUP (idle, "Mark complete" CTA, 1/3 setup)
Finance:     NOT SETUP (card only)
Legal:       NOT SETUP (card only)
Engineering: RUNNING (2 tasks active, 4 view tabs visible)
Design:      READY TO REVIEW (1 task completed - Brand Identity)
Marketing:   READY TO REVIEW (1 item - linked from roadmap)
Sales:       READY TO REVIEW (1 task completed - Define positioning)
```

### Complete Department Accent Color Map

| Department | Accent | Accent Soft | Status |
|:-----------|:-------|:------------|:-------|
| Operations | `#B16A27` | `rgba(177,106,39,0.18)` | Setup (idle) |
| Engineering | `#4087F2` | `rgba(64,135,242,0.18)` | Running: 2 |
| Design | `#8A72E5` | `rgba(138,114,229,0.18)` | Ready to review |
| Marketing | `#F46746` | `rgba(244,103,70,0.18)` | Ready to review |
| Sales | `#80A740` | `rgba(128,167,64,0.2)` | Ready to review |
| Support | TBD | TBD | Not setup |
| Finance | TBD | TBD | Not setup |
| Legal | TBD | TBD | Not setup |

---

## Appendix: Key URLs & Session Patterns

```
Canvas home:    /org/{org}/canvas
Tech tree:      /org/{org}/canvas?open_tech_tree=1
Agent task:     /org/{org}/canvas?session={uuid}&tab=taskAgents
Tasks page:     /org/{org}/tasks
```

---

*This audit was performed by systematically clicking through every department,
launching 3 agents (Sales, Design, Engineering), observing real task execution
(competitive analysis, brand identity, website build), and documenting all
state transitions, animations, and orchestration patterns from the live product.*
