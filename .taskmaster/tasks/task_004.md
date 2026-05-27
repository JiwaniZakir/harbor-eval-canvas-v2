# Task ID: 4

**Title:** Onboarding Wizard: 5-Step Setup Flow

**Status:** pending

**Dependencies:** 1, 2, 3

**Priority:** high

**Description:** Full onboarding wizard with premium animations and transitions.

File: src/components/studio/project-setup.tsx (single file, ~650 lines)

Wizard Shell:
- Full-viewport overlay with bg-l0
- Centered card: max-width 560px, bg-l100, radius-xl, shadow-outset-150
- Soft radial glow: 500x500px radial gradient, accent color at 15% opacity
- Step indicator: 5 dots (8px, gap 6px), active=fg-60, inactive=fg-15
- Transitions between steps: 300ms translateX + opacity

Step 1 - Project Name:
- Heading: 'What should we call this evaluation?' (Mondwest 600 22px fg-90)
- Subtext (Figtree 400 14px fg-40)
- Full-width input (48px, Figtree 400 16px, placeholder 'e.g. GPT-4o Safety Audit')
- Continue button disabled until >= 3 chars

Step 2 - Model Selection:
- Provider cards in grid: Google/Gemini, Anthropic/Claude, OpenAI/GPT, Meta/Llama
- Card: 100% width, 68px, provider logo 24px + name (Figtree 500 14px) + model slug (Departure 12px fg-40)
- Selected: border-fg-30, bg-fg-5, checkmark
- Custom model expandable input

Step 3 - Workflow Description:
- Textarea: 160px min-height, auto-resize
- 8 failure mode chips: Authority Ambiguity, False Recency, Instruction Drift, Schema Hallucination, Safety Boundary, Context Window, Tool Misuse, Calibration Collapse
- Chip click populates textarea with template text
- Chip style: inline-flex, radius-full, border fg-10, Figtree 400 12px

Step 4 - Clarifying Questions:
- Chat-style layout with 5 AI questions
- Agent message bubbles (left, avatar, bg-l200)
- 3-4 option cards per question with radio buttons
- 'Decide all' shortcut button
- Answered questions collapse with checkmark

Step 5 - Hypothesis Review:
- Shimmer loading bar (1.5s)
- Taxonomy badge (bg-fg-5, fg-60)
- Hypothesis text (EB Garamond italic 16px fg-70)
- Bad Heuristic + Authority Invariant sections
- 'Accept & Start Probing' dark CTA with ArrowRight

**Details:**

Full onboarding wizard with premium animations and transitions.

File: src/components/studio/project-setup.tsx (single file, ~650 lines)

Wizard Shell:
- Full-viewport overlay with bg-l0
- Centered card: max-width 560px, bg-l100, radius-xl, shadow-outset-150
- Soft radial glow: 500x500px radial gradient, accent color at 15% opacity
- Step indicator: 5 dots (8px, gap 6px), active=fg-60, inactive=fg-15
- Transitions between steps: 300ms translateX + opacity

Step 1 - Project Name:
- Heading: 'What should we call this evaluation?' (Mondwest 600 22px fg-90)
- Subtext (Figtree 400 14px fg-40)
- Full-width input (48px, Figtree 400 16px, placeholder 'e.g. GPT-4o Safety Audit')
- Continue button disabled until >= 3 chars

Step 2 - Model Selection:
- Provider cards in grid: Google/Gemini, Anthropic/Claude, OpenAI/GPT, Meta/Llama
- Card: 100% width, 68px, provider logo 24px + name (Figtree 500 14px) + model slug (Departure 12px fg-40)
- Selected: border-fg-30, bg-fg-5, checkmark
- Custom model expandable input

Step 3 - Workflow Description:
- Textarea: 160px min-height, auto-resize
- 8 failure mode chips: Authority Ambiguity, False Recency, Instruction Drift, Schema Hallucination, Safety Boundary, Context Window, Tool Misuse, Calibration Collapse
- Chip click populates textarea with template text
- Chip style: inline-flex, radius-full, border fg-10, Figtree 400 12px

Step 4 - Clarifying Questions:
- Chat-style layout with 5 AI questions
- Agent message bubbles (left, avatar, bg-l200)
- 3-4 option cards per question with radio buttons
- 'Decide all' shortcut button
- Answered questions collapse with checkmark

Step 5 - Hypothesis Review:
- Shimmer loading bar (1.5s)
- Taxonomy badge (bg-fg-5, fg-60)
- Hypothesis text (EB Garamond italic 16px fg-70)
- Bad Heuristic + Authority Invariant sections
- 'Accept & Start Probing' dark CTA with ArrowRight

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 4.1. Wizard shell with overlay, glow, step dots, transitions

**Status:** pending  
**Dependencies:** None  

### 4.2. Step 1: Project name input with validation

**Status:** pending  
**Dependencies:** None  

### 4.3. Step 2: Model selection cards with provider logos

**Status:** pending  
**Dependencies:** None  

### 4.4. Step 3: Workflow textarea with 8 failure mode chips

**Status:** pending  
**Dependencies:** None  

### 4.5. Step 4: Chat-style AI questions with option cards

**Status:** pending  
**Dependencies:** None  

### 4.6. Step 5: Hypothesis card with shimmer and accept CTA

**Status:** pending  
**Dependencies:** None  

### 4.7. Wire wizard completion to ProjectStore + DomainStore init + canvas transition

**Status:** pending  
**Dependencies:** None  

