# Task ID: 15

**Title:** Home Tab: Greeting + Progress Ring + Suggested Actions + Activity

**Status:** pending

**Dependencies:** 4, 5, 7

**Priority:** medium

**Description:** Home tab content in the right panel.

File: src/components/panel/home-tab.tsx

Greeting:
- Time-based: 'Good morning/afternoon/evening, Zakir' (Mondwest 600 22px fg-80)
- Project name below (Figtree 400 13px fg-40)

Progress Card:
- SVG ring: 56px diameter, 3px stroke, fg-5 base, fg-40 progress fill
- Center: percentage (Departure 600 20px fg-80)
- Label: 'domains evaluated' (Figtree 400 11px fg-40)
- Linear progress bar: 4px height, radius-full, fg-5 track, fg-40 fill
- Progress = count of published domains / 8

Suggested Next Cards (2-3):
- Uses Card primitive (interactive)
- Accent dot (6px, domain color) + action text (Figtree 500 13px fg-60) + ArrowRight
- Click navigates to relevant domain

Activity Feed:
- Time labels (Departure 11px fg-30, relative: '2m ago')
- Action descriptions (Figtree 400 13px fg-50)
- Dividers between items

**Details:**

Progress data comes from DomainStore - count domains with published status.
Suggested actions come from domains with actionable status (probe_queued, scaffold_queued, etc.).
Activity feed is mock data in MVP.

**Test Strategy:**

1. Greeting changes based on time of day
2. Progress ring fills correctly
3. Suggested cards show for actionable domains
4. Activity timestamps are relative

## Subtasks

### 15.1. Time-of-day greeting with Mondwest font

**Status:** pending  
**Dependencies:** None  

### 15.2. SVG progress ring with animated dashoffset + linear bar

**Status:** pending  
**Dependencies:** None  

### 15.3. Suggested next action Cards with accent dots

**Status:** pending  
**Dependencies:** None  

### 15.4. Activity feed with relative timestamps

**Status:** pending  
**Dependencies:** None  

