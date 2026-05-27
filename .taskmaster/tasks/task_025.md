# Task ID: 25

**Title:** Responsive Layout: Mobile + Tablet + Touch + Safe Areas

**Status:** pending

**Dependencies:** 1, 2

**Priority:** low

**Description:** Full responsive design implementation.

Mobile (<768px):
- Hide right panel entirely
- Full-width workspace plate
- Smaller progress ring (48px)
- Stack fan-out cards vertically
- Canvas scales down

Tablet (768-1023px):
- Narrow panel (300px instead of 360px)
- Adjusted canvas scale
- Compact fan-out grid

Touch (pointer: coarse):
- 44px minimum touch targets on all interactive elements
- Tree items, option cards, command palette items, trial rows

iOS Safe Areas:
- Bottom nav: padding-bottom env(safe-area-inset-bottom)
- Toast stack: bottom offset includes safe area

CSS breakpoints in globals.css as @media queries

**Details:**

Full responsive design implementation.

Mobile (<768px):
- Hide right panel entirely
- Full-width workspace plate
- Smaller progress ring (48px)
- Stack fan-out cards vertically
- Canvas scales down

Tablet (768-1023px):
- Narrow panel (300px instead of 360px)
- Adjusted canvas scale
- Compact fan-out grid

Touch (pointer: coarse):
- 44px minimum touch targets on all interactive elements
- Tree items, option cards, command palette items, trial rows

iOS Safe Areas:
- Bottom nav: padding-bottom env(safe-area-inset-bottom)
- Toast stack: bottom offset includes safe area

CSS breakpoints in globals.css as @media queries

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 25.1. Mobile breakpoint: hide panel, full-width plate, stack cards

**Status:** pending  
**Dependencies:** None  

### 25.2. Tablet breakpoint: narrow panel, compact grid

**Status:** pending  
**Dependencies:** None  

### 25.3. Touch targets: 44px minimums on all interactive elements

**Status:** pending  
**Dependencies:** None  

### 25.4. iOS safe area insets on bottom nav and toast

**Status:** pending  
**Dependencies:** None  

