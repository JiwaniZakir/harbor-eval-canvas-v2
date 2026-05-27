# Task ID: 8

**Title:** Onboarding Wizard: 5-Step Setup Flow

**Status:** pending

**Dependencies:** 2, 4, 5, 7

**Priority:** high

**Description:** Full 5-step onboarding wizard with premium animations. This is the FIRST thing users see.

File: src/components/studio/project-setup.tsx (~650 lines)

Wizard Shell:
- Full-viewport overlay, bg-l0
- Centered card: max-width 560px, bg-l100, radius-xl, shadow-outset-150
- Radial glow: 500x500px gradient, domain-accent at 15% opacity to transparent
- Step dots: 5 circles (8px, gap 6px), active=fg-60, inactive=fg-15
- Transitions: 300ms translateX + opacity between steps

Step 1 - Project Name:
- Heading: 'What should we call this evaluation?' (Mondwest 600 22px fg-90)
- Subtext (Figtree 400 14px fg-40)
- Input: uses UI primitive Input (lg size, 48px)
- Continue: uses UI primitive Button (primary, lg, full-width)
- Disabled until input >= 3 chars

Step 2 - Model Selection:
- 4 provider cards: Google/Gemini, Anthropic/Claude, OpenAI/GPT, Meta/Llama
- Card: uses UI primitive Card (interactive variant)
- Provider logo 24px + name (Figtree 500 14px) + model slug (Departure 12px fg-40)
- Selected: uses Card with accent border + checkmark

Step 3 - Workflow Description:
- Textarea: uses UI primitive Textarea (160px min-height)
- 8 failure mode chips: Authority Ambiguity, False Recency, Instruction Drift, Schema Hallucination, Safety Boundary, Context Window, Tool Misuse, Calibration Collapse
- Chip: uses Badge component (interactive, radius-full)
- Chip click populates textarea

Step 4 - Clarifying Questions:
- 5 AI questions in chat-style layout
- Agent message: left-aligned, 24px avatar, bg-l200 bubble
- 3-4 option cards per question (uses Card interactive)
- Radio button selection
- 'Decide all' shortcut: uses Button (secondary)
- Answered questions collapse with checkmark

Step 5 - Hypothesis Review:
- Shimmer loading bar (1.5s, uses shimmer keyframe)
- Taxonomy badge (uses Badge component)
- Hypothesis text: EB Garamond italic 16px fg-70
- 'Bad Heuristic' + 'Authority Invariant' sections
- 'Accept & Start Probing': uses Button (primary, lg) with ArrowRight icon

DESIGN CONSISTENCY: Every button is the Button primitive. Every input is the Input primitive. Every card is the Card primitive. This ensures the onboarding matches the rest of the app pixel-perfectly.

**Details:**

The onboarding is the user's first impression. It must feel premium - smooth animations, immediate feedback, clear hierarchy.

On completion (Step 5 accept):
1. ProjectStore.setProject() with name, model, workflow
2. DomainStore.initializeDomains() - all 8 set to 'untested'
3. UIStore.setSetupWizardOpen(false)
4. UIStore.setGlobalState('canvas_idle')
5. Primary domain set to 'probe_queued'

**Test Strategy:**

1. Wizard opens on first visit (no project in store)
2. Step transitions animate smoothly (300ms)
3. Input validation prevents empty project name
4. Model selection persists through steps
5. Chip click populates textarea correctly
6. 'Decide all' selects defaults for all questions
7. Completion stores project and transitions to canvas
8. All buttons/inputs use UI primitives (inspect class names)

## Subtasks

### 8.1. Wizard shell with overlay, glow effect, step dots, step transitions

**Status:** pending  
**Dependencies:** None  

### 8.2. Step 1: Project name with Input primitive + validation

**Status:** pending  
**Dependencies:** None  

### 8.3. Step 2: Model selection cards with Card primitive

**Status:** pending  
**Dependencies:** None  

### 8.4. Step 3: Workflow Textarea + 8 failure mode Badge chips

**Status:** pending  
**Dependencies:** None  

### 8.5. Step 4: Chat-style questions with option Card selections

**Status:** pending  
**Dependencies:** None  

### 8.6. Step 5: Hypothesis card with shimmer + Badge + Button CTA

**Status:** pending  
**Dependencies:** None  

### 8.7. Wire completion to stores: ProjectStore, DomainStore, UIStore

**Status:** pending  
**Dependencies:** None  

