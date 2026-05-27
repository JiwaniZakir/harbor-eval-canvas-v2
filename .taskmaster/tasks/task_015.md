# Task ID: 15

**Title:** Chat Card Components: Tool, Probe, Approval, Iteration, Sweep

**Status:** pending

**Dependencies:** 3, 11

**Priority:** medium

**Description:** 5 specialized card components embedded in agent chat messages.

File: src/components/panel/chat-cards.tsx

1. ToolCallCard (spec §6.2.4):
- 32px inline card, clickable to expand
- Running: Loader2 spinning 12px + 'Running: tool_name'
- Complete: Check green 12px + 'Completed: summary'
- Expandable detail: monospace output, max-height 200px, bg-l200

2. ProbeSummaryCard (spec §6.2.5):
- Header: domain name + taxonomy badge
- 5 variant bars: horizontal tracks with fill percentage
- Fill colors: good (green, >60%), mediocre (amber, 30-60%), bad (red, <30%)
- Mean + verdict row
- Actions: 'View Details' outlined + 'Accept & Scaffold →' dark CTA

3. ApprovalGateCard (spec §6.2.6):
- Amber border (2px #FDE68A), amber-50/30 bg
- AlertTriangle icon + title
- Body text with bullet list
- 'Reject' red outlined + 'Approve & Validate →' dark CTA

4. IterationCard (spec §6.2.7):
- File header: monospace filename + line ref
- Diff block: removed lines (red bg, '- ' prefix) + added lines (green bg, '+ ' prefix)
- Rationale: italic 12px
- 'Dismiss' + 'Apply Edit →'

5. SweepResultCard (spec §6.2.8):
- pass@k headline (Departure 700 20px)
- Trial rows with pass/fail badges

**Details:**

5 specialized card components embedded in agent chat messages.

File: src/components/panel/chat-cards.tsx

1. ToolCallCard (spec §6.2.4):
- 32px inline card, clickable to expand
- Running: Loader2 spinning 12px + 'Running: tool_name'
- Complete: Check green 12px + 'Completed: summary'
- Expandable detail: monospace output, max-height 200px, bg-l200

2. ProbeSummaryCard (spec §6.2.5):
- Header: domain name + taxonomy badge
- 5 variant bars: horizontal tracks with fill percentage
- Fill colors: good (green, >60%), mediocre (amber, 30-60%), bad (red, <30%)
- Mean + verdict row
- Actions: 'View Details' outlined + 'Accept & Scaffold →' dark CTA

3. ApprovalGateCard (spec §6.2.6):
- Amber border (2px #FDE68A), amber-50/30 bg
- AlertTriangle icon + title
- Body text with bullet list
- 'Reject' red outlined + 'Approve & Validate →' dark CTA

4. IterationCard (spec §6.2.7):
- File header: monospace filename + line ref
- Diff block: removed lines (red bg, '- ' prefix) + added lines (green bg, '+ ' prefix)
- Rationale: italic 12px
- 'Dismiss' + 'Apply Edit →'

5. SweepResultCard (spec §6.2.8):
- pass@k headline (Departure 700 20px)
- Trial rows with pass/fail badges

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 15.1. ToolCallCard with expand/collapse and 3 states

**Status:** pending  
**Dependencies:** None  

### 15.2. ProbeSummaryCard with variant bars and verdict

**Status:** pending  
**Dependencies:** None  

### 15.3. ApprovalGateCard with amber styling and action buttons

**Status:** pending  
**Dependencies:** None  

### 15.4. IterationCard with diff view (removed/added lines)

**Status:** pending  
**Dependencies:** None  

### 15.5. SweepResultCard with pass@k and trial rows

**Status:** pending  
**Dependencies:** None  

