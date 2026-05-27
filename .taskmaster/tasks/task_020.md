# Task ID: 20

**Title:** Sweeps Tab: Pass@k + Trial Rows + Trajectory + Comparison

**Status:** pending

**Dependencies:** 4, 5, 7

**Priority:** medium

**Description:** Sweep results tab.

File: src/components/panel/sweeps-tab.tsx

Latest Sweep Card (uses Card primitive):
- pass@3 headline: Departure 700 24px, color by result
  - good (model fails = good eval): green
  - bad (model passes = bad eval): red
  - partial: amber
- Sweep name + timestamp

Trial Rows:
- Badge (success/error) for pass/fail
- Summary: Figtree 400 13px fg-60
- Expandable: click shows trajectory
- Separator: border-bottom fg-5

Trajectory Viewer (expandable):
- Timeline with dot markers (green/red/gray)
- Step descriptions

Comparison Table:
- Colored bars (percentage width, domain accent color)
- Labels left, bars right

**Details:**

Data from DomainStore.domainStates[id].sweepSummary.

Uses Badge for trial status, Card for sweep container.

**Test Strategy:**

1. Pass@k shows correct color based on value
2. Trial badges show pass/fail correctly
3. Expandable trajectory works
4. Comparison bars fill proportionally

## Subtasks

### 20.1. Sweep Card with pass@k headline

**Status:** pending  
**Dependencies:** None  

### 20.2. Trial rows with Badge + expand for trajectory

**Status:** pending  
**Dependencies:** None  

### 20.3. Trajectory viewer with timeline dots

**Status:** pending  
**Dependencies:** None  

### 20.4. Comparison table with colored bars

**Status:** pending  
**Dependencies:** None  

