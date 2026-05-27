# Task ID: 4

**Title:** UI Primitives: Button, Input, Badge, Card, Dialog, Spinner

**Status:** pending

**Dependencies:** 2, 3

**Priority:** high

**Description:** Shared UI primitive components that enforce consistent design language across the ENTIRE platform. Every interactive element must use these primitives.

Files to create:
- src/components/ui/button.tsx: Primary (bg-fg-90, white text), Secondary (border fg-10, fg-60 text), Ghost (no border, fg-50), Danger (red). All sizes: sm(28px), md(36px), lg(44px). All have: radius-md, Figtree font, hover/active/disabled states, focus ring.
- src/components/ui/input.tsx: Text input with fg-5 border, bg-l200, Figtree 400 14px, placeholder fg-30. Focus: shadow-input-focus, border fg-10. Sizes: sm(32px), md(40px), lg(48px).
- src/components/ui/badge.tsx: Inline pill with radius-full, padding 2px 8px, Departure 11px. Variants: default(fg-5 bg), accent(domain-accent bg), success(green), warning(amber), error(red).
- src/components/ui/card.tsx: Container with bg-l200, border fg-10, radius-lg, padding 16px. Variants: default, elevated(shadow-outset-050), interactive(hover bg-fg-5).
- src/components/ui/dialog.tsx: Modal overlay (bg-fg-100 at 20%, blur 4px) + centered content (bg-l200, radius-lg, shadow-outset-150, max-width 400px). Close on ESC, close on backdrop click.
- src/components/ui/spinner.tsx: Loader2 icon with spin animation. Sizes: sm(14px), md(18px), lg(24px). Color inherits.
- src/components/ui/textarea.tsx: Multi-line input matching input.tsx styles but with auto-resize capability.
- src/components/ui/switch.tsx: Toggle switch, 36x20px, bg-fg-10 off, bg-fg-90 on, circle thumb.

DESIGN CONSISTENCY RULE: All components use ONLY CSS custom properties from Task 2. No hardcoded colors, no Tailwind color classes. Every radius is var(--radius-*), every shadow is var(--shadow-*), every color is var(--fg-*) or var(--bg-*).

**Details:**

These primitives are the building blocks. The onboarding wizard uses Button and Input. The project tab uses Card and Dialog. The command palette uses Input. The chat uses Textarea. Badges appear in sweeps, status indicators, and pipeline stages.

By building these FIRST with consistent tokens, every downstream component automatically has the same look and feel.

**Test Strategy:**

1. Render each component in isolation, verify it uses design tokens (inspect computed styles)
2. Verify hover/active/disabled states work
3. Verify focus ring appears on keyboard nav
4. Verify all sizes render correctly
5. Dialog closes on ESC and backdrop click

## Subtasks

### 4.1. Build Button with 4 variants (primary/secondary/ghost/danger) and 3 sizes

**Status:** pending  
**Dependencies:** None  

### 4.2. Build Input with focus states and 3 sizes

**Status:** pending  
**Dependencies:** None  

### 4.3. Build Badge with 5 variants (default/accent/success/warning/error)

**Status:** pending  
**Dependencies:** None  

### 4.4. Build Card with 3 variants (default/elevated/interactive)

**Status:** pending  
**Dependencies:** None  

### 4.5. Build Dialog with overlay, ESC close, backdrop close

**Status:** pending  
**Dependencies:** None  

### 4.6. Build Spinner, Textarea (auto-resize), Switch

**Status:** pending  
**Dependencies:** None  

