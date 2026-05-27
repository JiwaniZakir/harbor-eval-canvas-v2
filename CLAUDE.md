# Harbor Eval Canvas - Agent Guide

## Project Structure

```
src/app/globals.css     # DESIGN SYSTEM - all tokens, keyframes, component CSS
src/lib/types.ts        # ALL types + domain/pipeline/color constants
src/lib/utils.ts        # Utility functions (cn, formatRelativeTime, uid, etc.)
src/lib/stores/         # 5 Zustand stores
src/components/ui/      # Primitives - ALWAYS use these, never create ad-hoc buttons/inputs
src/components/layout/  # Shell components (topbar, nav, panel, toast, error boundary)
src/components/canvas/  # Canvas visualization (ring, plate, nodes)
src/components/panel/   # Tab content + chat cards
src/components/studio/  # Onboarding wizard + command palette
```

## Design Token Convention

**CRITICAL**: Never hardcode colors, radii, shadows, or fonts. Always use CSS custom properties:

```css
/* CORRECT */
color: var(--fg-80);
background: var(--bg-l200);
border-radius: var(--radius-md);
box-shadow: var(--shadow-outset-050);

/* WRONG */
color: #333;
background: #e7e5e4;
border-radius: 8px;
```

Brand colors (provider, file types) are centralized in `types.ts` as `PROVIDER_COLORS` and `FILE_TYPE_COLORS`.

## Component Patterns

### Always use UI primitives

```tsx
// CORRECT - uses Button primitive
<Button variant="primary" size="md">Save</Button>

// WRONG - custom button
<button className="my-custom-button">Save</button>
```

Available primitives: `Button`, `Input`, `Textarea`, `Badge`, `Card`, `Dialog`, `Spinner`, `Switch`

### State access via Zustand

```tsx
// Read state
const project = useProjectStore((s) => s.project);

// Write state  
const setActiveTab = useUIStore((s) => s.setActiveTab);
```

### Domain data attribute for accent colors

```tsx
<div data-domain={domainId}>
  {/* Inside this div, var(--domain-accent) resolves to the domain's color */}
</div>
```

## CSS Organization

All CSS is in `globals.css`, organized by section:
1. Custom properties (tokens)
2. Domain accent colors
3. Font loading
4. Global resets
5. Keyframes
6. Layout (§6)
7. UI Primitives (§7)
8. Onboarding (§8)
9. Canvas (§9)
10. Workspace (§10)
11. Fan-out (§11)
12. Panel tabs (§12)
13. Chat cards (§13)
14. Toast (§14)
15. Skeleton (§15)
16. Streaming/markdown (§16)
17. Errors (§17)
18. File upload (§18)
19. Command palette (§19)
20. Responsive (§20)

## Build Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npx tsc --noEmit     # Type check
```

## Light Theme Only

This app is light theme ONLY. No dark mode. Background is `#FAFAF9`, foreground base is `#1a1a1a`.
