# Task ID: 17

**Title:** Chat Card Components: Tool, Probe, Approval, Iteration, Sweep

**Status:** pending

**Dependencies:** 4, 5, 16

**Priority:** medium

**Description:** 5 specialized card types embedded in agent chat messages.

File: src/components/panel/chat-cards.tsx

1. ToolCallCard: Expandable 32px inline card. Uses Spinner when running.
2. ProbeSummaryCard: Variant bars + verdict Badge + Button CTAs.
3. ApprovalGateCard: Amber border card with AlertTriangle + approve/reject Buttons.
4. IterationCard: Diff view (removed=red, added=green lines) + apply/dismiss Buttons.
5. SweepResultCard: pass@k (Departure 700 20px) + trial rows with Badges.

DESIGN CONSISTENCY: All CTAs use Button primitive. All badges use Badge primitive. All containers use Card primitive styles. Colors use CSS variables only.

**Details:**

These cards appear inline in the Agent tab message flow. They are rendered based on ChatMessage.toolCalls and special message types.

The ProbeSummaryCard variant bars use fg-5 track + green/amber/red fill matching status colors from design tokens.

The diff view in IterationCard uses hardcoded semantic colors (red for removed, green for added) which is acceptable for code diffs.

**Test Strategy:**

1. Each card renders correctly with mock data
2. Expandable ToolCallCard opens/closes
3. Variant bars fill proportionally
4. Approve/reject buttons fire callbacks
5. Diff lines show correct colors and prefixes

## Subtasks

### 17.1. ToolCallCard with expand/collapse + Spinner

**Status:** pending  
**Dependencies:** None  

### 17.2. ProbeSummaryCard with variant bars + verdict Badge + Buttons

**Status:** pending  
**Dependencies:** None  

### 17.3. ApprovalGateCard with amber styling + approve/reject Buttons

**Status:** pending  
**Dependencies:** None  

### 17.4. IterationCard with diff view + apply/dismiss Buttons

**Status:** pending  
**Dependencies:** None  

### 17.5. SweepResultCard with pass@k headline + trial Badges

**Status:** pending  
**Dependencies:** None  

