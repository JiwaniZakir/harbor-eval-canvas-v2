# Task ID: 2

**Title:** Design Tokens: CSS Custom Properties + Font Loading

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** The design system foundation. Every visual element in the app references these tokens. This is the SINGLE SOURCE OF TRUTH for the entire visual language.

Create src/app/globals.css with ALL tokens:

Backgrounds (warm off-white scale):
--bg-l0: #FAFAF9 (page background)
--bg-l50: #F5F5F4 (subtle surface)
--bg-l100: #EFEEEC (panels, cards)
--bg-l200: #E7E5E4 (inputs, bubbles)
--bg-l-neg-50: #FEFEFD (elevated surfaces)

Foreground opacity scale (base #1a1a1a):
--fg-5: rgba(26,26,26,0.05) through --fg-100: rgba(26,26,26,1)
ALL intermediates: fg-8, fg-10, fg-15, fg-20, fg-25, fg-30, fg-40, fg-50, fg-55, fg-60, fg-70, fg-80, fg-90, fg-100

Typography:
--font-figtree: 'Figtree', system-ui, sans-serif (UI text)
--font-mondwest: 'Mondwest', serif (display headings)
--font-departure: 'Departure Mono', monospace (data/metrics)
--font-garamond: 'EB Garamond', serif (editorial/quotes)
--font-mono: 'Departure Mono', 'SF Mono', monospace (code)

Spacing:
--topbar-height: 48px
--panel-width: 360px
--bottom-height: 56px

Radius:
--radius-xs: 4px, --radius-sm: 6px, --radius-md: 8px, --radius-lg: 12px, --radius-xl: 16px, --radius-full: 9999px

Shadows:
--shadow-inset-025: inset 0 0.5px 1px rgba(0,0,0,0.025)
--shadow-inset-050: inset 0 1px 2px rgba(0,0,0,0.05)
--shadow-inset-200: inset 0 2px 6px rgba(0,0,0,0.08)
--shadow-outset-050: 0 1px 3px rgba(0,0,0,0.05)
--shadow-outset-150: 0 4px 16px rgba(0,0,0,0.08)
--shadow-input-focus: 0 0 0 3px rgba(26,26,26,0.06)

Easing:
--ease-smooth: cubic-bezier(0.4, 0, 0.2, 1)
--ease-spring: cubic-bezier(0.34, 1.56, 0.64, 1)

8 Domain Accent Colors with data-attribute selectors:
[data-domain='instruction_following'] { --domain-accent: #6366F1; }
[data-domain='reasoning_logic'] { --domain-accent: #8B5CF6; }
[data-domain='safety_alignment'] { --domain-accent: #EC4899; }
[data-domain='knowledge_factuality'] { --domain-accent: #F59E0B; }
[data-domain='calibration_uncertainty'] { --domain-accent: #10B981; }
[data-domain='multilinguality'] { --domain-accent: #06B6D4; }
[data-domain='long_context'] { --domain-accent: #3B82F6; }
[data-domain='tool_use_agency'] { --domain-accent: #EF4444; }

Status colors: --status-success: #16A34A, --status-warning: #D97706, --status-error: #DC2626, --status-info: var(--fg-40)

Font loading in layout.tsx:
- Google Fonts: Figtree (300,400,500,600,700), EB Garamond (400 italic, 600)
- Local @font-face: Mondwest-Regular.woff2, DepartureMono-Regular.woff2
- Font display: swap for all

Global resets:
- *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0 }
- body { font-family: var(--font-figtree); background: var(--bg-l0); color: var(--fg-80); -webkit-font-smoothing: antialiased }
- Focus ring: *:focus-visible { outline: 2px solid var(--fg-20); outline-offset: 2px }
- Mouse clicks excluded from focus ring: :focus:not(:focus-visible) { outline: none }
- Scrollbar: 6px, fg-10 thumb, transparent track, Firefox scrollbar-width: thin
- Reduced motion: @media (prefers-reduced-motion: reduce) { all animations/transitions → 0.01ms }

**Details:**

This is the most critical task. Every component references these tokens. If these are wrong, EVERYTHING looks wrong.

The fg opacity scale must be mathematically correct:
- fg-5 = rgba(26,26,26,0.05)
- fg-10 = rgba(26,26,26,0.10)
- fg-15 = rgba(26,26,26,0.15)
- fg-20 = rgba(26,26,26,0.20)
- fg-25 = rgba(26,26,26,0.25)
- fg-30 = rgba(26,26,26,0.30)
- fg-40 = rgba(26,26,26,0.40)
- fg-50 = rgba(26,26,26,0.50)
- fg-55 = rgba(26,26,26,0.55)
- fg-60 = rgba(26,26,26,0.60)
- fg-70 = rgba(26,26,26,0.70)
- fg-80 = rgba(26,26,26,0.80)
- fg-90 = rgba(26,26,26,0.90)
- fg-100 = rgba(26,26,26,1)

Font files must be placed in public/fonts/ and referenced via @font-face with correct paths.

**Test Strategy:**

1. All CSS variables resolve (no 'undefined' in computed styles)
2. Body renders with correct background (#FAFAF9) and text color
3. Figtree font loads and renders
4. Focus ring appears on Tab navigation but NOT on mouse click
5. Scrollbar is 6px thin
6. Domain accent colors change when data-domain attribute is set

## Subtasks

### 2.1. Create CSS custom properties: all backgrounds, foregrounds (15 values), typography, spacing, radius, shadows, easing

**Status:** pending  
**Dependencies:** None  

### 2.2. Add 8 domain accent colors with [data-domain] attribute selectors + status colors

**Status:** pending  
**Dependencies:** None  

### 2.3. Set up Google Fonts (Figtree, EB Garamond) + local @font-face (Mondwest, Departure)

**Status:** pending  
**Dependencies:** None  

### 2.4. Create public/fonts/ with Mondwest and Departure woff2 files

**Status:** pending  
**Dependencies:** None  

### 2.5. Add global resets: box-sizing, body styles, focus ring, scrollbar, reduced motion

**Status:** pending  
**Dependencies:** None  

