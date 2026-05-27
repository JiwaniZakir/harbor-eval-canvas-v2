# Harbor Eval Canvas - Product Requirements Document

## Overview
Harbor Eval Canvas is a visual AI evaluation creation platform that guides users through discovering, probing, scaffolding, and validating model weaknesses. The UI mirrors Cofounder.co's premium quality: light theme, Figtree typography, translucent glass panels, and pixel-perfect spacing.

**Tech Stack:** Next.js 16, React 19, TypeScript strict, Tailwind CSS v4, Zustand state management, Lucide icons. No React Flow - pure CSS/SVG canvas.

**Design System:** Light theme only. Background #FAFAF9 (warm off-white). Foreground opacity scale from fg-5 (#1a1a1a at 5%) through fg-100 (solid). Figtree for UI, Mondwest for display headings, Departure Mono for data/metrics, EB Garamond for editorial quotes.

## Target Users
AI researchers and evaluation engineers who need to create robust model evaluations. They understand LLM failure modes but lack tooling to systematically discover, probe, and validate weaknesses.

## Core User Flow
1. **Onboarding** (5-step wizard): Project name → Model selection → Workflow description → AI clarifying questions → Hypothesis review
2. **Canvas** (radial ring): 8 domain nodes arranged in a ring with connection lines to center hub. Progress ring shows global completion.
3. **Workspace** (per-domain pipeline): Click domain → workspace plate opens → Probe fan-out → Scaffold fan-out → Validation gates → Sweep results
4. **Panel** (right side): 5 tabs - Home (stats/activity), Agent (chat), Project (settings), Files (artifacts), Sweeps (results)
5. **Publish**: Export validated evaluation as shareable artifact

## Architecture

### Page Layout (spec §0.1)
- **Top bar**: Fixed 48px, avatar + project dropdown + model pill + settings gear
- **Canvas area**: Flex-1 center, contains radial ring or workspace plate
- **Right panel**: Fixed 360px, collapsible, contains 5 tab contents
- **Bottom nav**: Fixed 56px with safe areas, 5 tab icons synced with panel

### State Management
- **ProjectStore**: Project metadata, target model, global progress
- **DomainStore**: 8 domain states (22 possible statuses from untested→published)
- **UIStore**: Active tab, focused domain, panel state, setup wizard state, global state machine
- **AgentStore**: Chat messages, tool calls, streaming state

## Detailed Feature Requirements

### Phase 0: Design System Foundation

#### 0.1 CSS Custom Properties
Complete token system with 200+ variables:
- **Backgrounds**: --bg-l0 (#FAFAF9), --bg-l50 (#F5F5F4), --bg-l100 (#EFEEEC), --bg-l200 (#E7E5E4), --bg-l-neg-50 (#FEFEFD)
- **Foreground opacity scale**: --fg-5 through --fg-100 using rgba(26,26,26,N)
- **Typography**: --font-figtree, --font-mondwest, --font-departure, --font-garamond, --font-mono
- **Spacing**: --topbar-height (48px), --panel-width (360px), --bottom-height (56px)
- **Radius**: --radius-xs (4px), --radius-sm (6px), --radius-md (8px), --radius-lg (12px), --radius-xl (16px), --radius-full (9999px)
- **Shadows**: --shadow-inset-025, --shadow-inset-050, --shadow-inset-200, --shadow-outset-050, --shadow-outset-150, --shadow-input-focus
- **Easing**: --ease-smooth (cubic-bezier(0.4,0,0.2,1)), --ease-spring (cubic-bezier(0.34,1.56,0.64,1))
- **Domain accents**: 8 colors for each domain (instruction=#6366F1, reasoning=#8B5CF6, safety=#EC4899, knowledge=#F59E0B, calibration=#10B981, multilingual=#06B6D4, long_context=#3B82F6, tool_use=#EF4444)
- Data attribute selectors: [data-domain="instruction_following"] { --domain-accent: #6366F1; }

#### 0.2 Font Loading
Google Fonts: Figtree (300-700), EB Garamond (400i,600). Local: Mondwest, Departure Mono via @font-face with woff2.

#### 0.3 Global Styles
- Focus ring: 2px solid fg-20, 2px offset, only on :focus-visible (not mouse clicks)
- Scrollbar: 6px width, fg-10 thumb, transparent track, round corners
- Reduced motion: @media prefers-reduced-motion sets all animations to 0.01ms
- iOS safe areas: env(safe-area-inset-bottom) on bottom nav
- Responsive: mobile (<768px) hides panel, tablet (768-1023) narrows panel to 300px

### Phase 1: Global Shell

#### 1.1 Top Bar (spec §0.2)
- Fixed position, 48px height, bg-l100 background, fg-5 bottom border
- Left: 28px avatar circle (initials, bg-l0, fg-5 border) + project name dropdown (Figtree 500 14px, fg-80)
- Dropdown: 240px wide, bg-l200, radius-lg, shadow-outset-150, slide-up animation
- Breadcrumb: Shows "Project > Domain > Stage" when domain is focused (ChevronRight separators, fg-50/fg-30 colors)
- Right: Model pill (28px height, Departure font 12px, provider color dot 6px) + Settings gear (32px, Settings icon 18px)
- Model pill hover: bg-l50, border fg-20, color fg-80

#### 1.2 Bottom Navigation (spec §0.3)
- Fixed bottom, 56px + safe area, bg-l100, border-top fg-5
- 5 tabs: Home (House), Agent (MessageCircle), Project (FolderKanban), Files (FileCode2), Sweeps (BarChart3)
- Each tab: 44px touch target, icon 20px, label Figtree 400 10px
- Active state: fg-80 color, 2px accent underline (3px border-radius)
- Inactive: fg-40 color
- Badge dot: 6px circle on Sweeps tab when sweep is running (absolute positioned, accent color)

#### 1.3 Right Detail Panel (spec §0.4)
- Fixed right, 360px width, bg-l100, border-left fg-5
- Tab strip: 36px height, 5 tabs with active underline indicator
- Content area: Scrollable, 4px scrollbar, 16px padding
- Collapsible on mobile via panel toggle

### Phase 2: Onboarding Wizard (spec §1.1-1.5)

#### 2.1 Wizard Shell
- Full-viewport overlay, bg-l0 with centered card
- Card: max-width 560px, bg-l100, radius-xl, shadow-outset-150
- Soft radial glow behind card: 500x500px gradient from accent at 15% opacity to transparent
- Step indicator: 5 dots, 8px each, active=fg-60, inactive=fg-15, 6px gap
- Transitions: 300ms slide + fade between steps

#### 2.2 Step 1: Project Name
- Heading: "What should we call this evaluation?" (Mondwest 600 22px, fg-90)
- Subtext: "Give your evaluation project a clear, descriptive name" (Figtree 400 14px, fg-40)
- Input: Full width, 48px height, Figtree 400 16px, placeholder "e.g. GPT-4o Safety Audit"
- Continue button: Full width, 44px, bg-fg-90, white text, radius-md, hover bg-fg-100
- Validation: Minimum 3 characters, button disabled until valid

#### 2.3 Step 2: Model Selection
- Heading: "Which model are you evaluating?" (Mondwest 600 22px)
- Provider cards: Grid layout, each card 100% width, 68px height
- Card anatomy: Provider logo (24px) + provider name (Figtree 500 14px) + model name (Departure 12px, fg-40)
- Cards: Google/Gemini, Anthropic/Claude, OpenAI/GPT, Meta/Llama
- Selected state: border-fg-30, bg-fg-5, checkmark icon
- Custom model: Expandable text input for custom model slug

#### 2.4 Step 3: Workflow Description
- Heading: "Describe the workflow you want to evaluate" (Mondwest 600 22px)
- Textarea: 160px min-height, auto-resize, Figtree 400 14px
- Failure mode chips: 8 clickable chips that populate textarea with template text
- Chips: Authority Ambiguity, False Recency, Instruction Drift, Schema Hallucination, Safety Boundary, Context Window, Tool Misuse, Calibration Collapse
- Chip style: inline-flex, radius-full, border fg-10, Figtree 400 12px, fg-50
- Selected chip: bg-fg-5, border-fg-20, fg-80

#### 2.5 Step 4: AI Clarifying Questions
- Chat-style layout with 5 strategic questions from the AI
- Questions appear as agent messages (left-aligned, avatar, bg-l200 bubble)
- Each question has 3-4 option cards with radio buttons
- Option card: border fg-10, radius-md, padding 12px, Figtree 400 13px
- Selected: border-fg-30, bg-fg-5
- Custom input: Text field below options for freeform answer
- "Decide all" shortcut button: outlined style, selects recommended defaults
- Answered questions collapse to single line with checkmark

#### 2.6 Step 5: Hypothesis Review
- Hypothesis card with shimmer loading animation (1.5s)
- Badge: Taxonomy category (e.g. "Authority Ambiguity"), bg-fg-5, fg-60
- Main hypothesis: EB Garamond italic 16px, fg-70
- "Bad Heuristic" section: What the model does wrong
- "Authority Invariant" section: What should always hold true
- Accept CTA: "Accept & Start Probing" dark button with ArrowRight icon
- Edit link: "Edit hypothesis" text button below

### Phase 3: Radial Ring Canvas (spec §2.1-2.6)

#### 3.1 Canvas Container
- Flex-1 area, centered content, bg-l0
- Fixed 600x600 ring container, no zoom, no pan

#### 3.2 SVG Progress Ring
- Circle at center (300,300), radius 257px
- Base ring: 1px stroke, fg-10 color
- Progress ring: 2px stroke, fg-30 color, stroke-dasharray animation
- Progress = weighted average of all domain completion percentages
- Animated dashoffset transition: 600ms ease-smooth

#### 3.3 Domain Nodes (8 total)
- Positioned at 225px radius from center, evenly spaced (45° apart)
- Node: 98px wide, rounded-md, bg-l200 inner, fg-5 border outer
- Status dot: 6px circle, positioned top-left of label
- Label: Figtree 500 12px, fg-60 (hover/active: fg-80)
- Domains: Instructions (0°), Reasoning (45°), Safety (90°), Knowledge (135°), Calibration (180°), Multilingual (225°), Long Context (270°), Tool Use (315°)

#### 3.4 State-to-Visual Mapping (spec §9.3)
Each domain has 18 possible states that map to visual properties:
- **untested**: border fg-10, dot fg-20, dashed connection
- **probing**: 2px accent border + pulseGlow animation, accent dot + dotPulse, animated dashes, others dim to 0.5 opacity
- **probe_complete**: 2px accent border, solid accent dot
- **promoted/gate_passed**: 2px green-500 border, green dot
- **scaffolding**: 2px blue-500 border + pulseGlow, blue dot + dotPulse, animated blue dashes
- **validation_gate**: 2px purple-500 border, purple dot
- **published**: 2px green-600 border + left green bar, green dot with glow
- **rejected**: 2px red border, 0.7 opacity
- Plus: redesign, scaffold_queued, scaffold_complete, gate_failed, target_sweep, sweep_complete, iterating

#### 3.5 Connection Lines
- SVG lines from center hub (30px from center) to each node (15px from node)
- Style varies by domain state (dashed/solid/animated, color matches state)

#### 3.6 Center Hub
- 98px wide, positioned at exact center
- Contains Harbor Eval compass icon (28px SVG)
- "Harbor Eval" wordmark below (Figtree 400 10px, fg-40)
- Click deselects any focused domain

### Phase 4: Workspace Plate (spec §3-5)

#### 4.1 Plate Container
- 680px max-width, bg-l-neg-50, shadow-inset-200, radius-xl
- Header: Accent dot (8px) + domain name (Figtree 600 16px) + status badge + close button
- Status badges: 6 states with distinct bg/color pairs

#### 4.2 Probe Fan-out (spec §3.2)
- 5 variant cards in grid layout
- Variants: Plain, Prior Work, Schema Hint, Audit Trail, Speed Run
- Card: bg-l200, border fg-10, radius-md, 140px min-width
- States: idle, running (pulsing border), complete (green check), failed (red X)
- Stagger entrance: each card delays 80ms
- Mean failure rate and verdict displayed below

#### 4.3 Scaffold Fan-out (spec §4.2)
- 5 agent cards for scaffold artifacts
- Agents: Fixtures, Environment, Verifier, Instruction, Contamination
- Each card shows artifact label and generation status

#### 4.4 Validation Gates (spec §5.1)
- 3 gate cards: Oracle Sweep, Nop Sweep, Spoiler Lint
- States: pending (fg-20 dot), running (shimmer), passed (green check), failed (red X)

#### 4.5 Pipeline Roadmap Strip (spec §5.2)
- Horizontal strip with 5 stages: Intake → Probe → Scaffold → Validate → Publish
- Each stage: 72px card with icon, connected by line segments
- States: locked (fg-10 bg, fg-30 text), available (fg-5 bg, fg-60 text), active (fg-10 bg, fg-80 text, rotating loader), complete (green bg, white check)
- Connector: 24px wide segment, 2px height, colored by completion state

### Phase 5: Panel Tab Contents

#### 5.1 Home Tab (spec §6.1)
- Time-of-day greeting: "Good morning, Zakir" (Mondwest 600 22px)
- Progress card: SVG ring (56px, 3px stroke), percentage (Departure 600 20px), label
- Progress bar: 4px height, rounded, fg-5 track, fg-40 fill, animated width
- Suggested next cards: Border fg-10, accent dot, action text
- Activity feed: Time-relative labels, action descriptions

#### 5.2 Agent Tab (spec §6.2)
- Message list with auto-scroll
- Agent messages: Left-aligned, 24px avatar, bg-l200 bubble
- User messages: Right-aligned, blue-tinted bubble, max 85% width
- Tool call indicators: 32px height, inline, running/complete/failed states
- Typing indicator: 3 bouncing dots animation
- Chat composer: Auto-resize textarea, send + attach buttons
- **Embedded chat cards**: ToolCallCard, ProbeSummaryCard, ApprovalGateCard, IterationCard (diff view), SweepResultCard

#### 5.3 Project Tab (spec §6.3)
- Settings sections with key-value rows
- Model chips: Primary (starred) + secondary + add button
- Danger zone: Red text links for destructive actions
- Confirmation dialog: Overlay blur, red CTA, cancel button

#### 5.4 Files Tab (spec §6.4)
- Recursive file tree from artifacts
- Folder expand/collapse with chevron rotation
- File type icons with domain-specific colors
- Inline editor preview with code/preview toggle
- File upload: Drag-and-drop zone with progress bars

#### 5.5 Sweeps Tab (spec §6.5)
- Latest sweep card with pass@3 headline (Departure 700 24px)
- Trial rows: pass/fail badges, summary text, expandable details
- Trajectory viewer: Timeline with dot markers
- Comparison table: Colored bars for metric visualization

### Phase 6: Chat Card Components (spec §6.2.4-6.2.8)

#### 6.1 Tool Call Card
- Inline 32px card, expandable on click
- Running: Loader2 spinning icon, "Running: tool_name"
- Complete: Check icon green, "Completed: summary"
- Failed: AlertTriangle red
- Expandable detail: monospace output, max-height 200px

#### 6.2 Probe Summary Card
- Domain name + taxonomy badge header
- Variant bars: 5 horizontal bars with fill percentage, color-coded (good=green >60%, mediocre=amber 30-60%, bad=red <30%)
- Mean + verdict row with separator
- Action buttons: "View Details" (outlined) + "Accept & Scaffold →" (dark CTA)

#### 6.3 Approval Gate Card
- Amber border (2px #FDE68A), amber-50/30 background
- AlertTriangle icon + title
- Body text with bullet list of concerns
- Buttons: "Reject" (red outlined) + "Approve & Validate →" (dark CTA)

#### 6.4 Iteration Proposal Card
- File header: monospace filename + line reference
- Diff block: removed lines (red bg, "- " prefix) + added lines (green bg, "+ " prefix)
- Rationale: italic 12px description
- Buttons: "Dismiss" + "Apply Edit →"

#### 6.5 Sweep Result Card
- pass@k headline (Departure 700 20px, color by result)
- Trial rows with pass/fail badges
- Trial summary text

### Phase 7: Polish & Interactions

#### 7.1 Toast System
- Fixed bottom-right stack
- Color-coded dots: info (fg-40), success (green), warning (amber), error (red)
- Auto-dismiss with CSS progress bar countdown (5s default)
- Slide-up entrance animation

#### 7.2 Skeleton Loading
- 6 variants: line, title, circle, card, stat (shimmer gradient animation)
- 5 tab-specific skeleton layouts matching real content shapes

#### 7.3 Command Palette
- Cmd+K trigger, 480px centered dialog
- Search input with magnifying glass icon
- Keyboard navigation: arrow keys, Enter to select, Escape to close
- Grouped results: Actions and Navigation sections

#### 7.4 Streaming Text
- Character-by-character display with blinking cursor
- Respects prefers-reduced-motion (shows all text immediately)
- Markdown renderer for agent messages (headers, bold, italic, code blocks, lists)

#### 7.5 Error States
- Full-area error: icon circle + title + description + retry button
- Inline banner: red background, dismiss button
- Chat error bubble: inline in message list with retry

#### 7.6 File Upload
- Drag-and-drop zone with dashed border
- File type validation (JSON, JSONL, CSV, YAML, Python, Markdown)
- Upload progress bars per file
- Size limit: 50MB

#### 7.7 Animations & Keyframes
- pulseGlow: 2s ease-in-out infinite box-shadow pulse
- dotPulse: 1.4s ease-in-out scale+opacity pulse
- shimmer: 1.5s linear gradient sweep
- sd-slideUp: 150ms translateY(4px) → 0 with opacity
- sd-fadeIn: 200ms opacity 0 → 1
- cursorBlink: 1s step-end opacity toggle
- typingBounce: 1.4s translateY bounce for dots
- dashScroll: 1s linear stroke-dashoffset animation
- spin: 1s linear 360° rotation
- progress-fill: width 0 → target with ease

### Phase 8: State Machine & Keyboard

#### 8.1 Domain State Machine (22 states)
untested → probe_queued → probing → probe_complete → {promoted | redesign | rejected} → scaffold_queued → scaffolding → scaffold_complete → validation_gate → {gate_passed | gate_failed} → target_sweep → sweep_complete → {published | iterating}

#### 8.2 Global State Machine (8 states)
empty → onboarding → canvas_idle → probing → scaffolding → validating → calibrating → published

#### 8.3 Keyboard Shortcuts
- 1-5: Switch tabs
- Cmd+K: Command palette
- Escape: Close workspace/modal/dropdown
- Enter: Submit in onboarding/chat

### Phase 9: Responsive Design

#### 9.1 Mobile (<768px)
- Hide right panel
- Full-width workspace plate
- Smaller progress ring (48px)
- Stack layout for fan-out cards

#### 9.2 Tablet (768-1023px)
- Narrow panel (300px)
- Adjusted canvas scale

#### 9.3 Touch
- 44px minimum touch targets
- iOS safe area insets

### Phase 10: SVG Assets

#### 10.1 Pipeline Stage Icons (5)
Intake, Probe, Scaffold, Validate, Publish - each 24x24 SVG

#### 10.2 Domain Icons (8)
One per domain - instruction, reasoning, safety, knowledge, multilingual, code, creativity, multimodal

## Non-Functional Requirements

- **Performance**: First contentful paint < 1.5s, interaction to paint < 100ms
- **Accessibility**: Focus ring on keyboard nav, reduced motion support, ARIA labels on interactive elements
- **Type Safety**: TypeScript strict mode, zero type errors at all times
- **Code Quality**: Conventional commits, idiomatic React patterns, no unused exports
- **Testing**: TypeScript compilation as gate, visual verification of all states
