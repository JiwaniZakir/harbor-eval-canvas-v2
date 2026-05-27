# Task ID: 29

**Title:** Responsive Layout: Mobile + Tablet + Touch + iOS Safe Areas

**Status:** pending

**Dependencies:** 2, 7

**Priority:** low

**Description:** Full responsive design.

Mobile (<768px):
- Hide right panel
- Full-width workspace plate
- Smaller progress ring (48px)
- Stack fan-out cards vertically
- Canvas scales down via CSS transform

Tablet (768-1023px):
- Narrow panel: 300px
- Compact fan-out grid

Touch (pointer: coarse):
- 44px minimum touch targets: buttons, tree items, trial rows, command items

iOS Safe Areas:
- Bottom nav: padding-bottom env(safe-area-inset-bottom)
- Toast stack: bottom offset includes safe area

All breakpoints in globals.css as @media queries.

**Details:**

CRITICAL: Test on actual mobile viewport. The bottom nav must be usable with thumb reach. The panel must not overlap the canvas on tablet.

Touch targets: Apply to ALL interactive elements that are < 44px in desktop mode.

**Test Strategy:**

1. Mobile (375px): panel hidden, canvas centered, nav usable
2. Tablet (768px): panel narrows to 300px
3. Touch targets all ≥ 44px on touch devices
4. iOS safe area prevents bottom nav from being under home indicator

## Subtasks

### 29.1. Mobile breakpoint: hide panel, full-width plate, scale canvas

**Status:** pending  
**Dependencies:** None  

### 29.2. Tablet breakpoint: narrow panel, compact grid

**Status:** pending  
**Dependencies:** None  

### 29.3. Touch: 44px minimum targets on all interactive elements

**Status:** pending  
**Dependencies:** None  

### 29.4. iOS safe area insets

**Status:** pending  
**Dependencies:** None  

