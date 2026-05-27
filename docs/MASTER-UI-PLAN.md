# Harbor Eval Canvas: Master UI/UX Plan

> Definitive interaction design spec for the Harbor Eval Canvas rebuild.
> Visual language mirrors Cofounder.co's premium quality with Harbor's eval-specific functionality.
> Every interaction, icon, font, animation, and layout dimension is specified.

---

## Design System Foundation

### Typography Stack

| Role | Font | Weight | Size | Tracking | Usage |
|---|---|---|---|---|---|
| **Display / Hero** | PP Mondwest OTF | Regular | 28-36px | -0.02em | Greeting headlines ("Good evening, Zakir"), empty states |
| **Body / UI** | Figtree | 300-700 | 13-16px | -0.01em | All UI text, buttons, labels, navigation |
| **Chat content** | TT Neoris | Variable | 15px | 0 | Agent messages, user messages, streamed text |
| **Code / Data** | IBM Plex Mono | 400-600 | 13px | 0 | Artifact paths, TOML snippets, verifier output, terminal |
| **Mono accent** | Departure Mono | Regular | 12px | 0.02em | Status badges, pass@k scores, timestamps |
| **Serif accent** | EB Garamond | 400-800 | 14-18px | 0 | Pull quotes in reports, construct definitions, formal text |

### Color System (Light Mode Only)

```
Background Scale:
  --bg:                 #f1f1ee   (warm parchment, base canvas)
  --bg-l-negative-50:   #e8e8e4   (sunken cards, workspace plates)
  --bg-l0:              #ebebea   (button default)
  --bg-l50:             #f0f0ed   (button hover)
  --bg-l100:            #f7f7f5   (elevated panels, right sidebar)
  --bg-l200:            #fafaf8   (inner card surfaces)
  --bg-inverse:         #1a1a1a   (primary CTA buttons)
  --bg-screen:          linear-gradient(135deg, rgba(255,255,255,0.7), rgba(240,240,237,0.4))

Foreground Opacity Scale:
  --fg-100:             #1a1a1a   (primary text)
  --fg-80:              rgba(26,26,26, 0.8)   (secondary text)
  --fg-60:              rgba(26,26,26, 0.6)   (tertiary / labels)
  --fg-50:              rgba(26,26,26, 0.5)   (placeholders)
  --fg-30:              rgba(26,26,26, 0.3)   (borders, dividers)
  --fg-20:              rgba(26,26,26, 0.2)   (dashed lines, ring stroke)
  --fg-10:              rgba(26,26,26, 0.1)   (subtle borders)
  --fg-5:               rgba(26,26,26, 0.05)  (ghost elements)

Domain Accent Palette (8 domains):
  --accent-instructions:    #4087F2   (blue)
  --accent-reasoning:       #8A72E5   (purple)
  --accent-safety:          #F46746   (coral)
  --accent-knowledge:       #80A740   (green)
  --accent-calibration:     #B16A27   (amber)
  --accent-multilingual:    #3AAFA9   (teal)
  --accent-longcontext:     #E8596C   (rose)
  --accent-tooluse:         #6C63FF   (indigo)

Status Colors:
  --status-idle:        var(--fg-30)
  --status-probing:     #F5A623     (amber pulse)
  --status-confirmed:   #4CAF50     (green)
  --status-rejected:    #EF5350     (red)
  --status-building:    #42A5F5     (blue)
  --status-validating:  #AB47BC     (purple)
  --status-complete:    #66BB6A     (green solid)
```

### Shadow Recipes

```css
/* Elevated panels (right sidebar, modals) */
--shadow-outset-100: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);

/* Interactive nodes (domain pills, center hub) */
--shadow-outset-150: 0 2px 4px rgba(0,0,0,0.06), 0 8px 24px rgba(0,0,0,0.04);

/* Sunken containers (workspace plates) */
--shadow-inset-200: inset 0 1px 4px rgba(0,0,0,0.06), inset 0 0 1px rgba(0,0,0,0.08);

/* Screen / glass effect (center node) */
--shadow-screen: inset 0 1px 0 rgba(255,255,255,0.5), 0 1px 2px rgba(0,0,0,0.05);

/* CTA buttons */
--shadow-cta: 0 2px 3px rgba(0,0,0,0.2), 0 6px 6px rgba(0,0,0,0.05), 0 14px 8px rgba(0,0,0,0.03);

/* Chat input focused */
--shadow-input-focus: 0 0 0 2px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04);
```

### Animation Tokens

| Pattern | Duration | Easing | Usage |
|---|---|---|---|
| Hover lift | 150ms | ease-out | Cards, buttons, nodes |
| Color change | 200ms | ease-in-out | Background, border transitions |
| Shadow change | 200ms | ease-out | Focus, hover states |
| Panel slide | 300ms | cubic-bezier(0.16, 1, 0.3, 1) | Sidebar open/close, workspace expand |
| Fade in | 150ms | ease | New messages, cards appearing |
| Blur in | 200ms | ease | Modal backdrops, overlays |
| Slide up | 200ms | ease | Toast notifications, new list items |
| Shimmer | 5.5s | linear, infinite | Loading states, pending operations |
| Pulse glow | 2s | ease-in-out, infinite | Active probing indicator |
| Ring progress | 600ms | cubic-bezier(0.4, 0, 0.2, 1) | SVG ring fill animation |
| Fan-out stagger | 80ms per item | ease-out | Probe cards appearing in sequence |
| Node entrance | 400ms | spring(1, 80, 10) | Domain nodes placing on canvas |

### Border Radius Scale

```
--radius-xs:   4px    (inline badges)
--radius-sm:   6px    (inner card surfaces, option buttons)
--radius-md:   8px    (domain nodes, buttons, input fields)
--radius-lg:   12px   (right panel, workspace plates, modals)
--radius-xl:   22px   (expanded department cards)
--radius-full: 9999px (avatar circles, pill badges)
```

---

## Phase 0: Global Shell & Navigation

### Layout Geometry

```
┌──────────────────────────────────────────────────────────────────────┐
│  Top Bar  h=48px  bg-l100  shadow-outset-100  z-50                   │
│  [Avatar 28px] [Harbor Eval ▾] ··· gap ··· [Model: gemini-3 ▾] [⚙] │
├────────────────────────────────────┬─────────────────────────────────┤
│                                    │                                 │
│  Canvas Area                       │  Right Panel  w=460px           │
│  flex-1  bg=#f1f1ee                │  bg-l100  rounded-[12px]        │
│                                    │  my-2 mr-2  shadow-outset-100   │
│  Contains:                         │                                 │
│  - SVG ring + domain nodes         │  Tab bar at top                 │
│  - Workspace plates (expanded)     │  Scrollable content             │
│  - Connection lines                │  Chat composer at bottom        │
│                                    │                                 │
│                                    │                                 │
│                                    │                                 │
│                                    │                                 │
│                                    │                                 │
├────────────────────────────────────┴─────────────────────────────────┤
│  Bottom Tab Bar  h=48px  bg-l100  border-t border-fg-10  z-40       │
│  [Home] [Agent] [Project] [Files] [Sweeps]                           │
└──────────────────────────────────────────────────────────────────────┘
```

### Top Bar (h=48px)

**Left cluster:**
- Avatar: 28x28px circle, `rounded-full`, user initial or image, `bg-l0 text-fg-60`, `shadow-outset-100`
- Project name: Figtree 14px/500, `text-fg-80`, dropdown chevron `text-fg-30`
- Dropdown on click: project list + "New Project" option

**Right cluster:**
- Model selector: pill badge `h-7 rounded-md px-2.5`, Departure Mono 12px, shows current target model (e.g., "gemini-3-flash"), domain accent border on left edge, click opens model picker dropdown
- Settings gear: 20x20px icon, `text-fg-50 hover:text-fg-80`, `transition 200ms`

**Interactions:**
- Project dropdown: slide-down 200ms, `rounded-lg shadow-outset-150 bg-l200 border border-fg-10`, max 5 items + "New Project" with + icon
- Model selector dropdown: shows 3-5 model options as cards with provider icon + name + description, selected has checkmark + accent border

### Bottom Tab Bar (h=48px)

5 tabs, evenly distributed, each is a column flex with icon (20px) + label (Figtree 11px/500):

| Tab | Icon | Label | Content it reveals |
|---|---|---|---|
| Home | `house` outline | Home | Greeting, progress ring, suggested actions |
| Agent | `message-circle` outline | Agent | Chat panel, embedded cards, orchestrator interaction |
| Project | `folder-cog` outline | Project | Target model, eval metadata, run config |
| Files | `file-code-2` outline | Files | All generated artifacts, inline editor |
| Sweeps | `activity` outline | Sweeps | Sweep history, trajectories, pass@k results |

**Active tab indicator:**
- Sliding pill: `h-[3px] w-[32px] rounded-full bg-fg-80`, positioned below active icon
- Slides horizontally with `transition 300ms cubic-bezier(0.16, 1, 0.3, 1)`
- Active label: `text-fg-80 font-semibold`
- Inactive: `text-fg-40`

**Tab switch animation:**
- Content crossfade: outgoing fades out (100ms), incoming fades in (150ms) with 2px slide-up
- No full re-render; tabs are persistent (keep scroll position)

### Right Panel (w=460px)

**Container:**
- `bg-l100 rounded-[12px] shadow-outset-100`
- `my-2 mr-2` (8px margin from viewport edges)
- Full height minus top bar, bottom bar, margins
- Internal padding: `px-5 pt-4`
- Scrollable content area with `overflow-y-auto` styled scrollbar (4px wide, `bg-fg-10 rounded-full`)

**Panel header:**
- Context badge (like Cofounder's badge): `h-7 rounded-md px-2 gap-1.5`
  - Gradient background: `linear-gradient(180deg, #EFEFEC 0%, rgba(239,239,236,0.5) 100%)`
  - 16px icon on left (tab-specific)
  - Label: Figtree 12px/500
  - Example: `[⬡ Agent]` or `[📁 Files]`

**Chat composer (bottom of Agent tab):**
- Sticky at bottom of panel, `bg-l100`
- Input container: `rounded-[12px] border border-fg-10 bg-l200 shadow-input-focus(on focus)`
- Textarea: Figtree 14px/400, placeholder "Ask Harbor Eval..." in `text-fg-40`
- Left: attachment button (paperclip icon, 18px, `text-fg-40`)
- Right: submit button, 32x32px circle, `bg-inverse text-white`, arrow-up icon
  - Disabled when empty: `opacity-40 cursor-not-allowed`
  - Enabled: `shadow-cta`, hover `opacity-90`
- Height: auto-grows from 44px to max 140px

---

## Phase 1: Onboarding Flow

The onboarding is a **full-screen wizard** that converts to the canvas view on completion.
No canvas is visible during onboarding. The entire viewport is the onboarding experience.

### Step 1: Welcome + Project Name

**Layout:** Centered card, 480px max-width, vertically centered with slight upward bias (40% from top)

**Content:**
```
[Harbor Eval wordmark]         ← PP Mondwest 24px, text-fg-80
                                  with subtle letter-spacing: 0.04em

"What should we call            ← EB Garamond 22px/400, text-fg-60
 this evaluation project?"        line-height: 1.4

┌─────────────────────────┐    ← Input: h-12 rounded-md border border-fg-10
│ e.g., "Gemini Reasoning" │      bg-l200, Figtree 16px, autofocus
└─────────────────────────┘      placeholder text-fg-30

[Continue →]                   ← Full-width CTA: h-10 rounded-md bg-inverse
                                  text-white, Figtree 14px/600
                                  shadow-cta, disabled until input non-empty
```

**Animation:** Card fades in with blur-in (200ms). Input has a 400ms delay before autofocus cursor blink appears.

**Background:** Warm `bg` (#f1f1ee) with a single large, blurred radial gradient at 30% opacity centered behind the card (accent color from `--accent-reasoning`, radius 400px, blur 120px). This gradient subtly shifts hue across onboarding steps.

### Step 2: Target Model Selection

**Layout:** Same centered card pattern, 520px max-width

**Content:**
```
"Which model are you             ← EB Garamond 22px/400
 evaluating?"

┌─────────────────────────────────────┐
│ ◉ Gemini 3 Flash                    │  ← Model card: h-16 rounded-lg
│   Google  ·  Fast frontier model    │     border border-fg-10 bg-l200
│                                     │     Selected: border-2 border-fg-60
└─────────────────────────────────────┘     shadow-outset-100
┌─────────────────────────────────────┐
│ ○ Claude Sonnet 4                   │  ← Radio dot: 18px, border-2
│   Anthropic  ·  Latest reasoning    │     Selected: filled with fg-80
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ○ GPT-4o                            │
│   OpenAI  ·  Multimodal flagship    │
└─────────────────────────────────────┘
┌─────────────────────────────────────┐
│ ○ Custom model...                   │  ← Opens inline fields: API base,
│   Bring your own endpoint           │     model slug, runner type
└─────────────────────────────────────┘

[Continue →]
```

**Model card detail:**
- Provider icon: 20x20px, positioned left of name, sourced from `/providers/{name}.svg`
- Model name: Figtree 15px/600
- Provider + description: Figtree 13px/400, `text-fg-50`, separated by `·` in `text-fg-20`
- Selection: border transitions from `border-fg-10` to `border-fg-60` over 200ms, radio dot fills
- Hover: `bg-l50 translateY(-1px)` over 150ms

### Step 3: Workflow Description

**Layout:** Wider card, 560px max-width. This is where the conversational intake begins.

**Content:**
```
"Describe the workflow or          ← EB Garamond 22px/400
 capability you want to evaluate"

"Be specific about the domain,     ← Figtree 13px/400, text-fg-40
 the task, and what you think        line-height: 1.6, max-w-[420px]
 models get wrong."

┌─────────────────────────────────────┐
│                                     │  ← Rich text editor (ProseMirror/TipTap)
│  [Placeholder: "For example:        │     min-h-[140px], max-h-[240px]
│   Financial compliance workflows    │     rounded-lg border border-fg-10
│   where models must determine       │     bg-l200, Figtree 15px
│   certificate release eligibility   │     Focus: shadow-input-focus
│   by tracing transitive             │
│   revocation chains..."]            │
│                                     │
└─────────────────────────────────────┘

"Or pick a starting point:"       ← Figtree 12px/500, text-fg-40, mt-4

┌──────────┐ ┌──────────┐ ┌──────────┐
│ Authority │ │ Recency  │ │ Source   │  ← Failure mode chips
│ Ambiguity│ │ Bias     │ │ Fidelity │     h-8 rounded-full px-3
└──────────┘ └──────────┘ └──────────┘     Figtree 12px/500, text-fg-60
┌──────────┐ ┌──────────┐ ┌──────────┐     border border-fg-10, bg-l200
│ Phantom  │ │ Tie      │ │ Null     │     Hover: bg-l50, border-fg-20
│ Joins    │ │ Breaking │ │ Cascade  │     Click: fills textarea with
└──────────┘ └──────────┘ └──────────┘     template for that failure mode
┌─��────────┐ ┌──────────┐
│Provenance│ │Lifecycle │
└──────────┘ └──────────┘

[Submit to Harbor Agent →]
```

**Chip click behavior:**
- Selected chip: `bg-fg-80 text-white border-fg-80`, 200ms transition
- Populates the rich text editor with a pre-written template specific to that failure mode
- Template includes: domain context, hypothesized bad heuristic, what correct behavior looks like
- User can edit the template before submitting

### Step 4: AI Strategic Questions (Conversational)

**Layout:** Transitions to a **chat-style layout** within the onboarding card. The card expands to 600px wide and shifts slightly left to accommodate.

The orchestrator agent asks 3-5 clarifying questions. Each appears as a chat message with embedded option cards.

**Agent message format:**
```
┌─ Agent ──────────────────────────────────────────┐
│  ⬡  Harbor Eval                    10:42 AM      │  ← Avatar: 24px domain-colored hex icon
│                                                   │     Name: Figtree 13px/600
│  "To design an effective eval, I need to          │     Timestamp: Figtree 12px/400 text-fg-30
│   understand the output contract. What format      │
│   should the agent produce?"                       │  ← TT Neoris 15px, text-fg-80
│                                                   │     line-height: 1.6
│  ┌─────────────────────────────────────────────┐  │
│  │ ○  A structured spreadsheet (XLSX/CSV)      │  │  ← Option card: rounded-sm p-3
│  │    with specific sheets and columns          │  │     border border-fg-10 bg-l200
│  ├─────────────────────────────────────────────┤  │     Hover: bg-l50, border-fg-20
│  │ ○  A JSON/JSONL output with schema          │  │     Selected: border-fg-60, bg-l50
│  ├─────────────────────────────────────────────┤  │     Radio: 16px circle, border-2
│  │ ○  Code that passes specific tests          │  │
│  ├─────────────────────────────────────────────┤  │
│  │ ○  A written report or analysis             │  │
│  └─────────────────────────────────────────────┘  │
│                                                   │
│  ┌──────────────┐  ┌─────────────────┐            │
│  │ Decide all   │  │ Submit answer ■ │            │  ← "Decide all": h-8 rounded-md
│  └──────────────┘  └─────────────────┘            │     border border-fg-10 bg-l0
└───────────────────────────────────────────────────┘     Figtree 12px/500, text-fg-80
                                                          "Submit": bg-inverse text-white
                                                          shadow-cta
```

**Question sequence (5 questions):**

1. "What format should the agent produce?" (output contract)
2. "What data sources does the agent work with?" (fixture types)
3. "What's the specific mistake you think models make?" (failure mode refinement)
4. "How would a human expert solve this correctly?" (oracle behavior)
5. "What makes this genuinely hard, not just tricky?" (difficulty source)

**Interaction details:**
- Each question appears after the previous is answered (300ms slide-up animation)
- "Decide all" button: auto-selects the AI's recommended answer for all remaining questions (grays out options, shows checkmarks)
- "Submit answer": sends selected option, shows brief loading shimmer (1s), then next question
- Progress: `1/5`, `2/5` etc. shown as Departure Mono 11px text above the question, `text-fg-30`
- Back arrow (top-left): rewinds to previous question with reverse slide animation

### Step 5: Hypothesis Generation + Accept

After all questions answered, the agent generates a **Failure Mode Hypothesis Card**.

**Hypothesis card format:**
```
┌─ Failure Mode Hypothesis ─────────────────────────────────────────┐
│                                                                    │
│  LIFECYCLE / REVOCATION                    ← Departure Mono 11px   │
│                                               text-fg-40, uppercase│
│  "Models trust portal active states        ← TT Neoris 16px/500   │
│   and miss 2-hop revocation cascades"         text-fg-80           │
│                                                                    │
│  ┌─ Bad Heuristic ──────────────────────────────────────────────┐  │
│  │ Trust the portal export's "Active" column and publish a      │  │
│  │ confident release decision.                                  │  │
│  └──────────────────────────────────────────────────────────────┘  │
│  ← bg-l-negative-50 rounded-sm p-3, Figtree 13px text-fg-60       │
│                                                                    │
│  ┌─ Authority Invariant ────────────────────────────────────────┐  │
│  │ Dependency traces through the full certificate chain          │  │
│  │ determine release eligibility, not portal states.             │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                    │
│  Target: gemini-3-flash  ·  Domain: Reasoning & Logic             │
│  ← Departure Mono 11px, text-fg-30                                │
│                                                                    │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │            Accept & Start Probing  →                        │   │
│  └─────────────────────────────────────────────────────────────┘   │
│  ← Full-width CTA: h-10 rounded-md bg-inverse text-white          │
│     shadow-cta, Figtree 14px/600                                   │
│                                                                    │
│  [Edit hypothesis]  ← text link, Figtree 12px, text-fg-40         │
│                        underline on hover                          │
└────────────────────────────────────────────────────────────────────┘
```

**Card styling:**
- `rounded-xl bg-l200 border border-fg-10 shadow-outset-150`
- Max-width: 560px, centered
- Sections divided by `border-b border-fg-5` with 16px vertical padding each

**Accept animation (transition to canvas):**
1. Card scales down slightly (0.98) and fades to 0.5 (200ms)
2. Background gradient intensifies and shifts to domain accent color
3. Canvas elements begin rendering behind the fading card
4. Card disappears (200ms), canvas fully visible
5. Domain nodes animate in with staggered spring entrance (80ms delay between each, 400ms total)
6. Center hub fades in last with screen effect glow
7. Right panel slides in from right (300ms)
8. Total transition: ~1.2 seconds

---

## Phase 2: Radial Canvas

### Ring + Domain Nodes

**SVG Ring:**
```
Container: 600x600px, absolute centered on canvas
Transform-origin: center
Positioned: left: 50%, top: 50%, translate(-300px, -300px)

<svg width="600" height="600" viewBox="0 0 600 600">
  <!-- Base ring -->
  <circle cx="300" cy="300" r="257" fill="none"
          stroke="var(--fg-10)" stroke-width="1" />

  <!-- Progress ring (animated) -->
  <circle cx="300" cy="300" r="257" fill="none"
          stroke="var(--fg-30)" stroke-width="2"
          stroke-dasharray="1614.6"
          stroke-dashoffset="[calculated from global progress]"
          stroke-linecap="round"
          transform="rotate(-90 300 300)"
          style="transition: stroke-dashoffset 600ms cubic-bezier(0.4,0,0.2,1)" />
</svg>
```

**8 Domain Nodes (positioned on ring at 45-degree intervals):**

| Domain | Angle | X | Y | Accent |
|---|---|---|---|---|
| Instruction Following | 0deg (top) | 300 | 43 | #4087F2 |
| Reasoning & Logic | 45deg | 481.7 | 118.3 | #8A72E5 |
| Safety & Alignment | 90deg (right) | 557 | 300 | #F46746 |
| Knowledge & Factuality | 135deg | 481.7 | 481.7 | #80A740 |
| Calibration & Uncertainty | 180deg (bottom) | 300 | 557 | #B16A27 |
| Multilinguality | 225deg | 118.3 | 481.7 | #3AAFA9 |
| Long Context | 270deg (left) | 43 | 300 | #E8596C |
| Tool Use & Agency | 315deg | 118.3 | 118.3 | #6C63FF |

**Domain Node Component (each node):**

```
Outer: rounded-md p-[2px] bg-l100 shadow-outset-150
  transform: translate(-50%, -50%)
  transition: all 200ms ease-out

  Hover: bg-l50 shadow-outset-100 translateY(-1px)
  Active domain: border-2 border-[accent] shadow-[0_0_12px_accent/20]

Inner: rounded-sm bg-l200 px-3 py-1.5
  flex items-center gap-2

  Status dot: 6x6px rounded-full
    idle:     bg-fg-20
    probing:  bg-[accent] + pulse animation (2s ease-in-out infinite)
    confirmed: bg-status-confirmed
    rejected:  bg-status-rejected

  Label: Figtree 12px/500, text-fg-60
    Active: text-fg-80

  Shorthand: shows "Instructions" not "Instruction Following"
    (use shortLabel from domain config)
```

**Total node dimensions:** ~110px wide x 32px tall (varies by label length)

**Connection Lines (center to each domain):**
```
<line x1="300" y1="[center edge]" x2="[domain edge]" y2="[domain edge]"
      stroke="var(--fg-20)" stroke-width="1" stroke-dasharray="6 4" />

<!-- Inner dot (near center) -->
<circle cx="[inner]" cy="[inner]" r="3" fill="var(--fg-30)" />

<!-- Outer dot (near domain node) -->
<circle cx="[outer]" cy="[outer]" r="3" fill="var(--fg-30)" />
```

- Lines are clipped to not overlap with nodes (start 30px from center edge, end 15px from domain node edge)
- When a domain is active/probing, the line animates: dashes move outward (CSS `stroke-dashoffset` animation, 3s linear infinite)
- Confirmed domains: line becomes solid, `stroke: var(--fg-40)`

### Center Hub Node

```
Position: exactly center (300, 300), translate(-50%, -50%)
z-index: 60 (above all domain nodes)

Outer: w-[98px] rounded-md p-[2px] bg-l100 shadow-outset-150
  Hover: bg-l50

Inner: h-[54px] w-full rounded-sm bg-screen shadow-screen
  flex items-center justify-center overflow-hidden

  Screen reflectance overlay:
    position: absolute, inset-0
    background: linear-gradient(135deg, rgba(255,255,255,0.3) 0%, transparent 60%)
    clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%)
    pointer-events: none

  Content: Harbor Eval logo/icon
    Icon: generated illustration, 42px tall, centered
    Below icon: "Harbor Eval" wordmark, Figtree 10px/600 text-fg-50

  Click: opens the Agent tab in right panel
```

**Center node icon:** A custom-generated illustration (via Flux/GPT Image) of an abstract eval/measurement symbol - a stylized compass or gauge with an orbital ring, rendered in warm monochrome with slight accent tint, transparent background, optimized for 42px display. Should feel like Cofounder's ASCII sunflower - distinctive, premium, slightly playful.

### Domain Node Click Behavior

Clicking a domain node:
1. Node gets selected state (accent border, glow)
2. Other nodes dim slightly (`opacity-0.5`, 200ms)
3. Workspace plate animates open below the ring
4. Connection line to selected domain pulses once
5. Right panel switches to Agent tab with domain context

---

## Phase 3: Workspace Plates (Expanded Domain Views)

When a domain is clicked, a **workspace plate** expands below the radial canvas. Only one plate is open at a time.

### Workspace Plate Layout

```
┌─ Workspace Plate ──────────────────────────────────────────────────────┐
│                                                                         │
│  ┌─ Header ───────────────────────────────────────────────────────────┐ │
│  │  [●] Reasoning & Logic          PROBING  ·  3/5 variants done     │ │
│  │      ↑ accent dot 8px           ↑ Departure Mono 11px badge       │ │
│  │      ↑ Figtree 16px/600         ↑ status-probing color            │ │
│  │                                                          [✕]      │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌─ Fan-Out Grid ─────────────────────────────────────────────────────┐ │
│  │  (see Phase 4: Fan-Out Visualization)                              │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌─ Pipeline Roadmap Strip ───────────────────────────────────────────┐ │
│  │  [Intake ✓]───[Probe ⟳]───[Scaffold ○]───[Validate ○]───[Publish]│ │
│  │  (see Phase 5: Progress Bar)                                       │ │
│  └────────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

**Plate styling:**
- `rounded-xl bg-l-negative-50 shadow-inset-200`
- Max-width: 680px, centered below ring
- Margin-top: 24px from ring bottom
- Padding: 20px
- Entrance animation: height grows from 0, opacity 0->1, 300ms ease-out

**Header:**
- Accent dot: 8px circle with domain accent color
- Domain name: Figtree 16px/600, text-fg-80
- Status badge: Departure Mono 11px, uppercase, rounded-full px-2 py-0.5
  - IDLE: `bg-fg-5 text-fg-30`
  - PROBING: `bg-amber-50 text-amber-700 border border-amber-200`
  - BUILDING: `bg-blue-50 text-blue-700 border border-blue-200`
  - VALIDATING: `bg-purple-50 text-purple-700 border border-purple-200`
  - COMPLETE: `bg-green-50 text-green-700 border border-green-200`
  - FAILED: `bg-red-50 text-red-700 border border-red-200`
- Progress text: Figtree 12px/400, text-fg-40 (e.g., "3/5 variants done")
- Close button: 24px, `text-fg-30 hover:text-fg-60`, X icon

---

## Phase 4: Fan-Out Visualization

The fan-out grid lives inside the workspace plate. It shows parallel operations as a grid of **status cards**.

### Probe Fan-Out (5 variants)

When probing is active, 5 variant cards appear in a horizontal row:

```
┌─ Probe Variants ─────────────────────────────────────────────────────┐
│                                                                       │
│  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐  ┌────────┐        │
│  │  Plain  │  │ Prior  │  │ Schema │  │ Audit  │  │ Speed  │        │
│  │   ✓     │  │ Work   │  │   ⟳    │  │   ⟳    │  │   ○    │        │
│  │  12/15  │  │  ✓     │  │  8/15  │  │  3/15  │  │  ---   │        │
│  │  80%    │  │ 14/15  │  │  53%   │  │  20%   │  │        │        │
│  └────────┘  │  93%   │  └────────┘  └────────┘  └────────┘        │
│              └────────┘                                              │
│                                                                       │
│  Mean failure: 82%  ·  Verdict: PROMOTE                              │
│  ← Figtree 13px/600, text-fg-80                                     │
│  ← "PROMOTE" in Departure Mono 11px, text-green-600                 │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Variant card (each, 108px wide x 88px tall):**
```
Container: rounded-lg border border-fg-10 bg-l200 p-3
  text-align: center

Label: Figtree 12px/600, text-fg-60
  "Plain", "Prior Work", "Schema", "Audit", "Speed"

Status icon (center, 20px):
  Pending ○: text-fg-20, circle outline
  Running ⟳: text-accent, rotating animation (1s linear infinite)
  Success ✓: text-green-600, checkmark
  Failed ✗: text-red-500, x-mark

Trial count: IBM Plex Mono 12px/400, text-fg-40
  "12/15" (completed/total)

Failure rate: Departure Mono 14px/600
  ≥80%: text-green-600 (high failure = good eval)
  40-79%: text-amber-600
  <40%: text-red-500

Border-left: 3px solid accent when running
  3px solid green-500 when complete with high failure
```

**Stagger animation:** Cards appear left-to-right with 80ms delay between each (fan-out stagger token). Each card slides up 8px and fades in.

**Live updates:** Trial count and failure rate update in real-time. Numbers use a "counting up" animation (200ms ease-out per digit change).

### Scaffold Fan-Out (4-5 agents)

When scaffolding is active, the fan-out grid shows artifact-generation agents:

```
┌─ Scaffold Agents ────────────────────────────────────────────────────┐
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────��──┐                  │
│  │  📄 Fixtures │  │  🐳 Environ │  │  ✓ Verifier │                  │
│  │     ⟳        │  │     ✓       │  │     ⟳       │                  │
│  │  build_      │  │  Dockerfile │  │  test_       │                  │
│  │  inputs.py   │  │  task.toml  │  │  outputs.py  │                  │
│  │  847 lines   │  │  28 lines   │  │  312 lines   │                  │
│  └─────────────┘  └─────────────┘  └─────────────┘                  │
│                                                                       │
│  ┌─────────────┐  ┌─────────────┐                                    │
│  │  📝 Instruct │  │  🔍 Contam  │                                    │
│  │     ⟳        │  │     ✓       │                                    │
│  │  instruction │  │  0 overlaps │                                    │
│  │  .md         │  │  clean ✓    │                                    │
│  │  drafting... │  │             │                                    │
│  └─────────────┘  ��─────────────┘                                    │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Scaffold card (each, 140px wide x 100px tall):**
```
Container: rounded-lg border border-fg-10 bg-l200 p-3

Icon: 16px emoji or SVG icon, top-left
  Fixtures: document icon
  Environment: container/whale icon
  Verifier: shield-check icon
  Instruction: pencil-line icon
  Contamination: search icon

Agent name: Figtree 13px/600, text-fg-80

Status icon: same as probe cards (○/⟳/✓/✗), 16px, centered

Primary artifact: IBM Plex Mono 11px, text-fg-40
  Shows the main file being generated

Detail line: Figtree 11px/400, text-fg-30
  "847 lines" or "drafting..." or "28 lines"

Completed card: border-fg-20 (slightly more visible), status ✓ in green
Running card: left-border 3px accent, shimmer overlay on the card
```

### Validation Gate Fan-Out

After scaffold completes, three validation checks run:

```
┌─ Validation Gate ────────────────────────────────────────────────────┐
│                                                                       │
│  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐   │
│  │  Oracle Sweep     │  │  Nop Sweep        │  │  Spoiler Lint    │   │
│  │                   │  │                   │  │                   │   │
│  │   Reward: 1.0 ✓   │  │   Reward: 0.0 ✓   │  │   0 findings ✓   │   │
│  │                   │  │                   │  │                   │   │
│  │   Expected: 1.0   │  │   Expected: 0.0   │  │   Expected: 0    │   │
│  └──────────────────┘  └──────────────────┘  └──────────────────┘   │
│                                                                       │
│  ✓ All gates passed                        [Run Target Sweep →]     │
│  ← Figtree 13px/500, text-green-600        ← CTA button             │
│                                                                       │
└───────────────────────────────────────────────────────────────────────┘
```

**Gate card (each, 180px wide x 80px tall):**
```
Passed: rounded-lg border border-green-200 bg-green-50/50 p-3
Failed: rounded-lg border border-red-200 bg-red-50/50 p-3
Pending: rounded-lg border border-fg-10 bg-l200 p-3 + shimmer

Title: Figtree 13px/600
Result: Departure Mono 16px/700 (large, prominent)
Expected: Figtree 11px/400, text-fg-30
```

---

## Phase 5: Pipeline Roadmap Strip

The roadmap strip sits at the bottom of each workspace plate. It mirrors Cofounder's tech tree step cards.

### Step Cards (5 stages)

```
[Intake]───[Probe]───[Scaffold]───[Validate]───[Publish]
```

Each step card: **148px wide x 56px tall**

```
┌──────────��───────────────────────────────┐
│  ┌──────┐                         [✓/🔒] │
│  │ ICON │  Stage Name                     │
│  │ 32px │  Status subtitle                │
│  └──────┘                                 │
└──────────────────────────────────────────┘
```

**Step card styling:**
```
Container: rounded-lg bg-screen p-2.5 flex items-center gap-2.5

Icon container: 32x32px rounded-md flex items-center justify-center
  Icon: 18px SVG, masked with:
    mask-image: url("/eval-icons/{stage}.svg")
    background-color: var(--fg-50)
  Active stage: background-color: var(--domain-accent)

Stage name: Figtree 13px/500, text-fg-60
  Active: text-fg-80, font-weight: 600

Status subtitle: Figtree 11px/400, text-fg-30
  "Completed" / "Running 3/5..." / "Waiting" / "Locked"

Status badge (top-right corner):
  Locked: 🔒 icon, 14px, text-fg-20
  Available: ○ circle outline, text-fg-30
  Active: ⟳ rotating, domain accent color
  Complete: ✓ checkmark, text-green-600

Card states:
  Locked: opacity-0.5, cursor-not-allowed
  Available: full opacity, cursor-pointer, hover: translateY(-1px)
  Active: border-2 border-[accent], shadow-[0_0_8px_accent/15]
  Complete: border-l-3 border-green-500
```

**Connector between cards:**
```
Width: 32px, centered vertically between cards

Line: h-[1px] w-full bg-fg-10
  Active connection: bg-fg-30
  Complete connection: bg-green-500

Center icon on connector:
  Locked: lock icon, 12px, text-fg-20
  Available: circle, 12px, text-fg-30
  Complete: checkmark, 12px, text-green-500
```

### Step Card Icons (to generate)

| Stage | Icon concept | Style |
|---|---|---|
| Intake | Funnel / inbox tray | Line art, 18px, warm monochrome |
| Probe | Radar / signal waves | Line art, 18px, pulsing when active |
| Scaffold | Building blocks / scaffolding | Line art, 18px |
| Validate | Shield with checkmark | Line art, 18px |
| Publish | Rocket / flag | Line art, 18px |

Generate via Flux 2 Pro or GPT Image 2: "minimal line-art icon, single stroke weight, warm gray on transparent background, 64x64px, [concept], suitable for UI at 18px display size"

---

## Phase 6: Right Panel - Tab Content Deep Dive

### Home Tab

```
┌─ Home Tab Content ───────────────────────────────────────────────┐
│                                                                   │
│  "Good evening, Zakir"              ← PP Mondwest 24px, text-fg-60│
│                                       Greeting changes by time    │
│                                                                   │
│  ┌─ Progress Ring Card ─────────────────────────────────────────┐ │
│  │                                                               │ │
│  │  ┌─────────┐  Overall Progress                               │ │
│  │  │  SVG    │  ████████░░░░░░ 35%                             │ │
│  │  │  ring   │  2 of 8 domains probed                          │ │
│  │  │  120px  │  1 task pack published                          │ │
│  │  └─────────┘                                                  │ │
│  │                                                               │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  ← rounded-xl bg-l200 border border-fg-10 p-4                    │
│                                                                   │
│  "Suggested Next"                   ← Figtree 13px/600 text-fg-40│
│                                       uppercase, tracking-wider   │
│                                                                   │
│  ┌─ Suggested Task Card ────────────────────────────────────────┐ │
│  │  ● Run probes for Safety domain                              │ │
│  │    High failure rate expected based on hypothesis             │ │
│  │                                               [Start →]      │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  ← rounded-lg border border-fg-10 bg-l200 p-3, hover: bg-l50     │
│                                                                   │
│  ┌─ Suggested Task Card ────────────────────────────────────────┐ │
│  │  ● Review Reasoning probe results                            │ │
│  │    3/5 variants complete, verdict pending                    │ │
│  │                                               [Review →]     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  "Recent Activity"                  ← Figtree 13px/600 text-fg-40│
│                                                                   │
│  ┌─ Activity Item ──────────────────────────────────────────────┐ │
│  │  ✓ Scaffold complete for Reasoning                  2m ago   │ │
│  │  ⟳ Probing Safety - variant 2/5                     5m ago   │ │
│  │  ✓ Hypothesis accepted                             12m ago   │ │
│  └───────────────────────────────────────────────────────────────┘ │
│  ← Each: flex items-center gap-2 py-2, border-b border-fg-5      │
│     Icon 16px, Figtree 13px text-fg-60, timestamp text-fg-30     │
│                                                                   │
└──────────────────────────────────────────────────────────────────��┘
```

### Agent Tab (Chat)

The primary interaction surface. All orchestrator communication happens here.

**Message types and their card formats:**

1. **Text message** (agent or user)
```
Avatar (24px) + Name (13px/600) + Timestamp (12px/400 text-fg-30)
Body: TT Neoris 15px, text-fg-80, line-height 1.6
User messages: right-aligned, bg-l200 rounded-lg p-3
Agent messages: left-aligned, no background
```

2. **Tool call indicator** (inline in agent message)
```
┌─ Tool Call ─────────────────────────────────────────┐
│  ⟳  Running: run_probe_variants                     │
│      Reasoning domain, plain variant, 15 trials     │
└─────────────────────────────────────────────────────┘
← h-8 flex items-center gap-2 px-3
← rounded-md bg-fg-5 border border-fg-10
← icon: 12px spinner or toggle SVG, text-fg-30
← text: Figtree 12px/400, text-fg-40
← Completed: ✓ icon, text shows summary ("82% failure rate")
```

3. **Embedded question card** (described in Phase 1, Step 4)

4. **Probe summary card** (embedded after probing completes)
```
┌─ Probe Results ─────────────────────────────────────────────┐
│  Reasoning & Logic  ·  Authority Ambiguity                   │
│                                                              │
│  Plain: 80%  Prior: 93%  Schema: 73%  Audit: 86%  Speed: 100%│
│  ← Departure Mono 12px, color-coded bars                    │
│                                                              │
│  Mean: 86%  →  Verdict: PROMOTE ✓                           │
│                                                              │
│  [View Details]  [Accept & Scaffold →]                       │
└──────────────────────────────────────────────────────────────┘
← rounded-lg border border-fg-10 bg-l200 p-4
← Variant bars: 4px tall rounded-full, width proportional to failure rate
```

5. **Sweep result card**
```
┌─ Target Sweep Results ──────────────────────────────────────┐
│  pass@3: 0/3                        ← Departure Mono 20px  │
│                                        text-green-600       │
│  Trial 1: FAILED  ·  missed cascade                        │
│  Trial 2: FAILED  ·  trusted portal state                  │
│  Trial 3: FAILED  ·  wrong join semantics                  │
│                                                              │
│  [View Trajectories]  [Publish →]                           │
└──────────────────────────────────────────────────────────────┘
```

6. **Approval gate card**
```
┌─ Approval Required ─────────────────────────────────────────┐
│  ⚠ Review scaffold before validation                         │
│                                                              │
│  The verifier checks 4 dimensions:                          │
│  • Structural (file format, sheets, headers)                │
│  • Routing (trap family assignment)                         │
│  • Attribution (source field correctness)                   │
│  • Summary (aggregate count accuracy)                       │
│                                                              │
│  [Reject]              [Approve & Validate →]               │
│  ← outlined button     ← dark CTA                          │
└──────────────────────────────────────────────────────────────┘
← rounded-lg border-2 border-amber-200 bg-amber-50/30 p-4
```

7. **Iteration proposal card** (diff format)
```
┌─ Iteration Proposal ────────────────────────────────────────┐
│  instruction.md  ·  line 42                                  │
│                                                              │
│  - Do not normalize certificate IDs.                        │  ← red bg
│  + Match certificate IDs exactly as they appear in the      │  ← green bg
│    dependency registry export.                              │
│                                                              │
│  Rationale: Explicit "do not" instructions are trivially    │
│  followed by models. Reframe as a positive bridge rule.     │
│  ← Figtree 12px/400 italic, text-fg-40                     │
│                                                              │
│  [Dismiss]  [Apply Edit →]                                  │
└──────────────────────────────────────────────────────────────┘
← rounded-lg border border-fg-10 bg-l200 p-4
← Diff lines: IBM Plex Mono 12px, bg-red-50/bg-green-50
```

### Project Tab

```
┌─ Project Tab Content ────────────────────────────────────────┐
│                                                               │
│  "Project Settings"               ← Figtree 16px/600         │
│                                                               │
│  ┌─ Target Model ──────────────────────────────────────────┐ │
│  │  Provider: Google                                        │ │
│  │  Model: gemini-3-flash-preview                          │ │
│  │  Runner: gemini-cli                                     │ │
│  │  [Change Model]                                         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ Auditor Model ─────────────────────────────────────────┐ │
│  │  claude-sonnet-4 (must differ from target)              │ │
│  │  [Change]                                               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ Run Config ────────────────────────────────────────────┐ │
│  │  Hash: rcfg_m1a2b3_gemini3flash                         │ │
│  │  Trials per variant: 15                                 │ │
│  │  pass@k: 3                                              │ │
│  │  Timeout: 300s                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ Multi-Model Comparison ────────────────────────────────┐ │
│  │  "Add models to compare against"                        │ │
│  │                                                          │ │
│  │  ┌──────────────┐  ┌───────────┐  ┌─────┐              │ │
│  │  │ gemini-3 ★   │  │ claude-4  │  │  +  │              │ │
│  │  │ (primary)    │  │ (added)   │  │     │              │ │
│  │  └──────────────┘  └─��─────────┘  └─────┘              │ │
│  │  ← Model chips: h-8 rounded-md px-2                    │ │
│  │  ← Primary: border-2 border-fg-60, star icon           │ │
│  │  ← Added: border border-fg-10                          │ │
│  │  ← Plus: dashed border, text-fg-30, opens model picker │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ Eval Metadata ─────────────────────────────────────────┐ │
│  │  Construct: Lifecycle / Revocation                      │ │
│  │  Taxonomy: Authority chain tracing                      │ │
│  │  Created: 2026-05-26                                    │ │
│  │  Last sweep: 2026-05-26 21:14                           │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ Danger Zone ───────────────────────────────────────────┐ │
│  │  [Reset Project]  [Delete All Artifacts]                │ │
│  │  ← text-red-500 links, confirmation dialog on click     │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

**Multi-Model Selection flow:**
- Click `+` chip -> dropdown with model options (same cards as onboarding Step 2)
- Selected model appears as a new chip
- Up to 5 models can be added
- Each gets its own sweep column in the Sweeps tab
- Primary model (star) determines probe difficulty calibration

### Files Tab

```
┌─ Files Tab Content ──────────────────────────────────────────┐
│                                                               │
│  "Artifacts"                       ← Figtree 16px/600        │
│  "6 files  ·  2,847 lines"        ← Figtree 12px/400 fg-40  │
│                                                               │
│  ┌─ File Tree ─────────────────────────────────────────────┐ │
│  │  📁 task-pack/                                           │ │
│  │  ├── 📄 instruction.md           847 lines    [●]       │ │
│  │  ├── 📄 task.toml                 28 lines    [✓]       │ │
│  │  ├── 📁 environment/                                    │ │
│  │  │   ├── 🐳 Dockerfile            18 lines    [✓]       │ │
│  │  │   └── 📁 data/                                       │ │
│  │  │       └── 🐍 build_inputs.py   912 lines   [●]       │ │
│  │  ├── 📁 solution/                                        │ │
│  │  │   └── 📜 solve.sh             142 lines    [⚠]       │ │
│  │  └── 📁 tests/                                           │ │
│  │      ├── 📜 test.sh                8 lines    [✓]       │ │
│  │      └── 🐍 test_outputs.py      312 lines    [●]       │ │
│  └──────────────────────────────────────────────────────────┘ │
│  ← File tree: IBM Plex Mono 13px, text-fg-60                 │
│  ← Badges: [●] modified, [✓] clean, [⚠] needs review        │
│  ← Click file: opens inline editor below                     │
│                                                               │
│  ┌─ Editor ────────────────────────────────────────────────┐ │
│  │  instruction.md                [Spoiler Lint: 0 ✓] [✕]  │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  # Compliance Certificate Release Assessment             │ │
│  │                                                          │ │
│  │  You are a compliance analyst at a pharmaceutical...     │ │
│  │  ...                                                     │ │
│  │  ───────────────────────────────────────────────────────  │ │
│  │  ← Monaco/CodeMirror editor, IBM Plex Mono 13px          │ │
│  │  ← Line numbers: text-fg-20                              │ │
│  │  ← Spoiler lint highlights: bg-red-100 border-l-2 red    │ │
│  │  ← Markdown rendering toggle in top-right                │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

### Sweeps Tab

```
┌─ Sweeps Tab Content ─────────────────────────────────────────┐
│                                                               │
│  "Sweep History"                   ← Figtree 16px/600        │
│                                                               │
│  ┌─ Latest Sweep Card ─────────────────────────────────────┐ │
│  │                                                          │ │
│  │  pass@3: 0/3 ✓                  ← Departure Mono 24px   │ │
│  │  Target: gemini-3-flash          ← Figtree 13px fg-40   │ │
│  │  Run: 2026-05-26 21:14           ← Figtree 12px fg-30   │ │
│  │                                                          │ │
│  │  ┌─ Trial 1 ───────────────────────────────────────────┐ │ │
│  │  │  FAILED  ·  reward: 0                               │ │ │
│  │  │  "Trusted portal export; missed transitive          │ │ │
│  │  │   revocation cascade through CERT-A17"              │ │ │
│  │  │                              [View Trajectory →]    │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  ← rounded-md border border-fg-10 bg-l200 p-3           │ │
│  │  ← "FAILED": Departure Mono 11px text-red-500           │ │
│  │  ← Summary: TT Neoris 13px text-fg-60                   │ │
│  │                                                          │ │
│  │  ┌─ Trial 2 ───────────────────────────────────────────┐ │ │
│  │  │  ...similar...                                      │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  │  ┌─ Trial 3 ───────────────────────────────────────────┐ │ │
│  │  │  ...similar...                                      │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │                                                          │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ Multi-Model Comparison (if multiple models selected) ──┐ │
│  │                                                          │ │
│  │  Model              pass@3    Mean reward                │ │
│  │  gemini-3-flash      0/3      0.00  ████████████         │ │
│  │  claude-sonnet-4     1/3      0.33  ██████░░░░░░         │ │
│  │  gpt-4o              0/3      0.00  ████████████         │ │
│  │  ← IBM Plex Mono 13px for model names                   │ │
│  │  ← Departure Mono 13px for scores                       │ │
│  │  ← Bar: h-2 rounded-full, green = failure = good        │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
│  ┌─ Trajectory Viewer (expanded on "View Trajectory") ─────┐ │
│  │                                                          │ │
│  │  Trial 1 Trajectory  ·  42 steps  ·  287s               │ │
│  │                                                          │ │
│  │  Step 1: read_file("/root/data/certificates.xlsx")      │ │
│  │    → Read 2,847 bytes                                   │ │
│  │                                                          │ │
│  │  Step 2: read_file("/root/data/policy_update.pdf")      │ │
│  │    → Read 14,203 bytes                                  │ │
│  │                                                          │ │
│  │  Step 3: write_file("/root/solution/analysis.py")       │ │
│  │    → 142 lines of analysis code                         │ │
│  │    ⚠ Used portal "Active" column directly               │ │
│  │                                                          │ │
│  │  Step 4: execute("python analysis.py")                  │ │
│  │    → Generated release_report.xlsx                      │ │
│  │    ✗ Missing CERT-A17 revocation cascade                │ │
│  │                                                          │ │
│  │  ← Tool calls: IBM Plex Mono 12px, text-fg-60           │ │
│  │  ← Results: Figtree 12px, text-fg-40                    │ │
│  │  ← Warnings: ⚠ text-amber-600, bg-amber-50 rounded     │ │
│  │  ← Errors: ✗ text-red-600, bg-red-50 rounded            │ │
│  │  ← Each step: border-l-2 border-fg-10, left-padding     │ │
│  │     Active step: border-l-2 border-domain-accent         │ │
│  └──────────────────────────────────────────────────────────┘ │
│                                                               │
└───────────────────────────────────────────────────────────────┘
```

---

## Phase 7: Generated Assets Spec

### Icons to Generate (via GPT Image 2 or Flux 2 Pro)

All icons: transparent background, warm monochrome line art, consistent 2px stroke weight, 64x64px source, displayed at 18-32px.

| Icon | Prompt | Usage |
|---|---|---|
| harbor-logo | "Minimal compass with orbital ring, single line weight, warm gray, geometric, transparent bg, 64x64" | Center hub node |
| stage-intake | "Minimal funnel/inbox tray icon, single line weight, warm gray, transparent bg, 64x64" | Pipeline step |
| stage-probe | "Minimal radar/signal wave icon, concentric arcs, single line weight, warm gray, transparent bg, 64x64" | Pipeline step |
| stage-scaffold | "Minimal building blocks/scaffolding icon, single line weight, warm gray, transparent bg, 64x64" | Pipeline step |
| stage-validate | "Minimal shield with checkmark icon, single line weight, warm gray, transparent bg, 64x64" | Pipeline step |
| stage-publish | "Minimal flag/rocket launch icon, single line weight, warm gray, transparent bg, 64x64" | Pipeline step |
| domain-instructions | "Minimal checklist icon, single line weight, blue tint, transparent bg, 64x64" | Domain node |
| domain-reasoning | "Minimal brain/logic gate icon, single line weight, purple tint, transparent bg, 64x64" | Domain node |
| domain-safety | "Minimal shield alert icon, single line weight, coral tint, transparent bg, 64x64" | Domain node |
| domain-knowledge | "Minimal open book icon, single line weight, green tint, transparent bg, 64x64" | Domain node |
| domain-calibration | "Minimal gauge/meter icon, single line weight, amber tint, transparent bg, 64x64" | Domain node |
| domain-multilingual | "Minimal globe with text/languages icon, single line weight, teal tint, transparent bg, 64x64" | Domain node |
| domain-longcontext | "Minimal scroll/document stack icon, single line weight, rose tint, transparent bg, 64x64" | Domain node |
| domain-tooluse | "Minimal wrench/gear icon, single line weight, indigo tint, transparent bg, 64x64" | Domain node |

### Domain Illustration Cards (for workspace plate headers)

Larger illustrations (256x256px) for each domain, used as subtle background art in workspace plate headers at 20% opacity:

Prompt template: "Abstract geometric illustration representing [domain concept], minimal shapes, soft gradients, [accent color] tint on white, modern data visualization aesthetic, transparent background, 256x256"

---

## Phase 8: Micro-Interactions & Polish

### Shimmer Loading State

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
    rgba(0, 0, 0, 0.04) 48%,
    transparent 60%,
    transparent 100%
  ) 0% 0% / 260% 100%;
  animation: 5.5s linear infinite shimmer;
}
```
Applied to: pending tool calls, loading cards, skeleton states.

### Pulse Glow (Active Probing)

```css
@keyframes pulse-glow {
  0%, 100% { box-shadow: 0 0 4px var(--accent); }
  50% { box-shadow: 0 0 16px var(--accent), 0 0 4px var(--accent); }
}

.probing { animation: pulse-glow 2s ease-in-out infinite; }
```
Applied to: domain nodes during active probing, connection lines.

### Counting Animation (Numbers)

When trial counts, failure rates, or pass@k scores update:
- Old number fades out with 2px slide-up (100ms)
- New number fades in with 2px slide-down (150ms)
- Uses `tabular-nums` font-variant for stable width

### Card Hover Lift

```css
.card-interactive {
  transition: transform 150ms ease-out, box-shadow 200ms ease-out;
}
.card-interactive:hover {
  transform: translateY(-1px);
  box-shadow: var(--shadow-outset-150);
}
.card-interactive:active {
  transform: translateY(0);
}
```

### Toast Notifications

Position: bottom-right, 16px from edges, stacked upward with 8px gap.

```
┌─ Toast ─────────────────────────────────────────┐
│  ✓  Scaffold complete for Reasoning domain      │
│                                          [✕]    │
└─────────────────────────────────────────────────┘
← rounded-lg bg-l200 border border-fg-10 shadow-outset-150
← Figtree 13px, p-3
← Icon: 16px, colored by type (green ✓, amber ⚠, red ✗)
← Entrance: slide-up 8px + fade-in, 400ms ease
← Auto-dismiss: 5s, exit: fade-out 200ms
```

### Screen Reflectance Effect (Center Hub)

```css
.screen-reflectance::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(255, 255, 255, 0.35) 0%,
    rgba(255, 255, 255, 0.08) 40%,
    transparent 60%
  );
  clip-path: polygon(0 0, 100% 0, 85% 100%, 0 100%);
  pointer-events: none;
  border-radius: inherit;
}
```

### Scrollbar Styling

```css
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb {
  background: var(--fg-10);
  border-radius: 9999px;
}
::-webkit-scrollbar-thumb:hover {
  background: var(--fg-20);
}
```

---

## Phase 9: State Machine & Interaction Flow

### Global State Transitions

```
EMPTY → ONBOARDING → CANVAS_IDLE → PROBING → SCAFFOLDING → VALIDATING → CALIBRATING → PUBLISHED
                                      ↑                                        │
                                      └────────────── ITERATING ◄──────────────┘
```

### Per-Domain State Machine

```
UNTESTED → PROBE_QUEUED → PROBING → PROBE_COMPLETE
                                        │
                              ┌─────────┼──────────┐
                              ▼         ▼          ▼
                          PROMOTED   REDESIGN   REJECTED
                              │
                              ▼
                      SCAFFOLD_QUEUED → SCAFFOLDING → SCAFFOLD_COMPLETE
                                                           │
                                                           ▼
                                                    VALIDATION_GATE
                                                      │    │
                                                   PASS  FAIL → fix → retry
                                                      │
                                                      ▼
                                              TARGET_SWEEP → SWEEP_COMPLETE
                                                                  │
                                                        ┌─────────┼──────────┐
                                                        ▼         ▼          ▼
                                                  pass@3=0    pass@3>0   ERROR
                                                  (READY)     (ITERATE)
                                                     │            │
                                                     ▼            ▼
                                                  PUBLISH    ITERATION_LOOP
                                                               │
                                                               └→ back to
                                                                  TARGET_SWEEP
```

### What Changes on Screen for Each State

| State | Canvas | Workspace Plate | Right Panel | Bottom Bar |
|---|---|---|---|---|
| EMPTY | Hidden | Hidden | Setup wizard | Hidden |
| ONBOARDING | Hidden | Hidden | Onboarding chat | Hidden |
| CANVAS_IDLE | Ring + 8 nodes (all idle) | Hidden | Home tab, greeting | All tabs |
| PROBING | Active domain glows + pulses | Open: probe fan-out grid | Agent tab: live updates | Sweeps badge |
| SCAFFOLDING | Active domain blue border | Open: scaffold fan-out grid | Agent tab: artifact notifications | Files badge |
| VALIDATING | Active domain purple | Open: validation gate cards | Agent tab: gate results | Sweeps badge |
| CALIBRATING | Active domain accent | Open: sweep results | Agent tab: trajectory analysis | Sweeps active |
| ITERATING | Active domain amber pulse | Open: iteration diff view | Agent tab: proposal cards | Files badge |
| PUBLISHED | Domain node: green ✓ | Collapsed, green accent | Agent tab: publish confirmation | All quiet |

---

## Implementation Priority Order

| Order | Phase | Deliverable | Depends On |
|---|---|---|---|
| 1 | Phase 0 | Global shell: top bar, bottom tabs, right panel container | Nothing |
| 2 | Phase 1 Steps 1-2 | Onboarding: project name + model selection | Phase 0 |
| 3 | Phase 2 | Radial canvas: ring, 8 domain nodes, center hub, connection lines | Phase 0 |
| 4 | Phase 1 Steps 3-5 | Onboarding: workflow input, AI questions, hypothesis card | Phase 0, Phase 6 Agent tab |
| 5 | Phase 6 Agent tab | Right panel chat: messages, tool calls, embedded cards | Phase 0 |
| 6 | Phase 3 | Workspace plates: header, expand/collapse | Phase 2 |
| 7 | Phase 5 | Pipeline roadmap strip inside workspace plates | Phase 3 |
| 8 | Phase 4 Probes | Probe fan-out visualization | Phase 3, Phase 6 |
| 9 | Phase 4 Scaffold | Scaffold fan-out visualization | Phase 3, Phase 6 |
| 10 | Phase 4 Validation | Validation gate cards | Phase 4 Scaffold |
| 11 | Phase 6 Home tab | Home: greeting, progress ring, suggested actions | Phase 0, Phase 2 |
| 12 | Phase 6 Files tab | File tree + inline editor + spoiler lint | Phase 4 Scaffold |
| 13 | Phase 6 Sweeps tab | Sweep history, trajectory viewer, multi-model comparison | Phase 4 Validation |
| 14 | Phase 6 Project tab | Settings, multi-model selection, run config | Phase 0 |
| 15 | Phase 7 | Generate all icons and illustrations | Any time |
| 16 | Phase 8 | Micro-interactions, shimmer, animations, polish | All phases |
| 17 | Phase 9 | State machine wiring, end-to-end flow | All phases |
