# Task ID: 1

**Title:** Design System: CSS Custom Properties & Font Loading

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Create the complete design token system as CSS custom properties. This is the foundation every other component depends on.

Implement in src/app/globals.css:
- Background scale: --bg-l0 (#FAFAF9), --bg-l50 (#F5F5F4), --bg-l100 (#EFEEEC), --bg-l200 (#E7E5E4), --bg-l-neg-50 (#FEFEFD)
- Foreground opacity scale: --fg-5 through --fg-100 using rgba(26,26,26,N) where N maps to percentage
- All intermediate values: fg-8, fg-15, fg-55, fg-70, fg-90
- Typography variables: --font-figtree, --font-mondwest, --font-departure, --font-garamond, --font-mono
- Spacing: --topbar-height (48px), --panel-width (360px), --bottom-height (56px)
- Radius: xs(4px), sm(6px), md(8px), lg(12px), xl(16px), full(9999px)
- Shadows: inset-025, inset-050, inset-200, outset-050, outset-150, input-focus
- Easing: --ease-smooth (cubic-bezier(0.4,0,0.2,1)), --ease-spring (cubic-bezier(0.34,1.56,0.64,1))
- 8 domain accent colors with data-attribute selectors
- Status colors for success/warning/error/info

Font loading in src/app/layout.tsx:
- Google Fonts: Figtree (300-700), EB Garamond (400i, 600)
- Local @font-face: Mondwest (woff2), Departure Mono (woff2)
- Font files in public/fonts/

Global styles:
- Focus ring: 2px solid fg-20, only on :focus-visible
- Scrollbar: 6px width, fg-10 thumb, transparent track
- Reduced motion media query
- Base reset and box-sizing

**Details:**

Create the complete design token system as CSS custom properties. This is the foundation every other component depends on.

Implement in src/app/globals.css:
- Background scale: --bg-l0 (#FAFAF9), --bg-l50 (#F5F5F4), --bg-l100 (#EFEEEC), --bg-l200 (#E7E5E4), --bg-l-neg-50 (#FEFEFD)
- Foreground opacity scale: --fg-5 through --fg-100 using rgba(26,26,26,N) where N maps to percentage
- All intermediate values: fg-8, fg-15, fg-55, fg-70, fg-90
- Typography variables: --font-figtree, --font-mondwest, --font-departure, --font-garamond, --font-mono
- Spacing: --topbar-height (48px), --panel-width (360px), --bottom-height (56px)
- Radius: xs(4px), sm(6px), md(8px), lg(12px), xl(16px), full(9999px)
- Shadows: inset-025, inset-050, inset-200, outset-050, outset-150, input-focus
- Easing: --ease-smooth (cubic-bezier(0.4,0,0.2,1)), --ease-spring (cubic-bezier(0.34,1.56,0.64,1))
- 8 domain accent colors with data-attribute selectors
- Status colors for success/warning/error/info

Font loading in src/app/layout.tsx:
- Google Fonts: Figtree (300-700), EB Garamond (400i, 600)
- Local @font-face: Mondwest (woff2), Departure Mono (woff2)
- Font files in public/fonts/

Global styles:
- Focus ring: 2px solid fg-20, only on :focus-visible
- Scrollbar: 6px width, fg-10 thumb, transparent track
- Reduced motion media query
- Base reset and box-sizing

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 1.1. Create CSS custom properties for backgrounds, foregrounds, typography, spacing, radius, shadows, easing

**Status:** pending  
**Dependencies:** None  

### 1.2. Add 8 domain accent colors with [data-domain] attribute selectors

**Status:** pending  
**Dependencies:** None  

### 1.3. Set up font loading (Google Fonts + local @font-face)

**Status:** pending  
**Dependencies:** None  

### 1.4. Add global focus ring, scrollbar, reduced motion, box-sizing

**Status:** pending  
**Dependencies:** None  

### 1.5. Create public/fonts/ directory with Mondwest and Departure woff2 files

**Status:** pending  
**Dependencies:** None  

