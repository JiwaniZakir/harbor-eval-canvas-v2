# Task ID: 10

**Title:** Home Tab: Greeting + Progress Ring + Activity Feed

**Status:** pending

**Dependencies:** 2, 3

**Priority:** medium

**Description:** Home tab content for the right panel.

File: src/components/panel/home-tab.tsx

Greeting:
- Time-based: 'Good morning/afternoon/evening, Zakir' (Mondwest 600 22px fg-80)
- Below: project name (Figtree 400 13px fg-40)

Progress Card:
- SVG progress ring: 56px diameter, 3px stroke
- Base: fg-5 stroke. Fill: fg-40 stroke with dashoffset
- Center text: percentage (Departure 600 20px fg-80)
- Label below ring: 'domains evaluated' (Figtree 400 11px fg-40)
- Linear progress bar: 4px height, rounded-full, fg-5 track, fg-40 fill
- Animated width transition on mount

Suggested Next Cards (2-3):
- Border fg-10, radius-md, padding 12px
- Accent dot (6px, domain color) + action text (Figtree 500 13px fg-60)
- Arrow icon on right
- Click navigates to relevant domain/action

Activity Feed:
- Recent actions list
- Time label: relative ('2m ago', '1h ago') in Departure 11px fg-30
- Description: Figtree 400 13px fg-50
- Divider line between items

**Details:**

Home tab content for the right panel.

File: src/components/panel/home-tab.tsx

Greeting:
- Time-based: 'Good morning/afternoon/evening, Zakir' (Mondwest 600 22px fg-80)
- Below: project name (Figtree 400 13px fg-40)

Progress Card:
- SVG progress ring: 56px diameter, 3px stroke
- Base: fg-5 stroke. Fill: fg-40 stroke with dashoffset
- Center text: percentage (Departure 600 20px fg-80)
- Label below ring: 'domains evaluated' (Figtree 400 11px fg-40)
- Linear progress bar: 4px height, rounded-full, fg-5 track, fg-40 fill
- Animated width transition on mount

Suggested Next Cards (2-3):
- Border fg-10, radius-md, padding 12px
- Accent dot (6px, domain color) + action text (Figtree 500 13px fg-60)
- Arrow icon on right
- Click navigates to relevant domain/action

Activity Feed:
- Recent actions list
- Time label: relative ('2m ago', '1h ago') in Departure 11px fg-30
- Description: Figtree 400 13px fg-50
- Divider line between items

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 10.1. Time-of-day greeting with Mondwest font

**Status:** pending  
**Dependencies:** None  

### 10.2. SVG progress ring with animated dashoffset

**Status:** pending  
**Dependencies:** None  

### 10.3. Suggested next action cards

**Status:** pending  
**Dependencies:** None  

### 10.4. Activity feed with relative timestamps

**Status:** pending  
**Dependencies:** None  

