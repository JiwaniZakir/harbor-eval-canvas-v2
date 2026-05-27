# Task ID: 14

**Title:** Sweeps Tab: Pass@k Card + Trial Rows + Trajectory Viewer

**Status:** pending

**Dependencies:** 2, 3

**Priority:** medium

**Description:** Sweeps results tab.

File: src/components/panel/sweeps-tab.tsx

Latest Sweep Card:
- pass@3 headline: Departure 700 24px, color by result (green=model fails=good eval, red=model passes=bad eval, amber=partial)
- Sweep name and timestamp
- Border fg-10, radius-lg, bg-l200

Trial Rows:
- Pass/fail badge: Departure 11px uppercase, radius-xs
- Failed: red text on red-50 bg. Passed: green text on green-50 bg
- Summary text: Figtree 400 13px fg-60
- Expandable: click to show trajectory details
- Border-bottom fg-5 separator

Trajectory Viewer (expandable):
- Timeline with dot markers for each step
- Dot colors: green for pass, red for fail, gray for pending
- Step description text
- Scrollable horizontally if many steps

Comparison Table:
- Colored bars showing metric values
- Labels on left, bars extending right
- Bar width proportional to value

**Details:**

Sweeps results tab.

File: src/components/panel/sweeps-tab.tsx

Latest Sweep Card:
- pass@3 headline: Departure 700 24px, color by result (green=model fails=good eval, red=model passes=bad eval, amber=partial)
- Sweep name and timestamp
- Border fg-10, radius-lg, bg-l200

Trial Rows:
- Pass/fail badge: Departure 11px uppercase, radius-xs
- Failed: red text on red-50 bg. Passed: green text on green-50 bg
- Summary text: Figtree 400 13px fg-60
- Expandable: click to show trajectory details
- Border-bottom fg-5 separator

Trajectory Viewer (expandable):
- Timeline with dot markers for each step
- Dot colors: green for pass, red for fail, gray for pending
- Step description text
- Scrollable horizontally if many steps

Comparison Table:
- Colored bars showing metric values
- Labels on left, bars extending right
- Bar width proportional to value

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 14.1. Latest sweep card with pass@k headline

**Status:** pending  
**Dependencies:** None  

### 14.2. Trial rows with pass/fail badges and expand

**Status:** pending  
**Dependencies:** None  

### 14.3. Trajectory viewer with timeline dots

**Status:** pending  
**Dependencies:** None  

### 14.4. Comparison table with colored bars

**Status:** pending  
**Dependencies:** None  

