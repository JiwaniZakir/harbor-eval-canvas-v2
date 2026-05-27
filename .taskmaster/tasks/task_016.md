# Task ID: 16

**Title:** Agent Tab: Message List + Composer + Typing Indicator

**Status:** pending

**Dependencies:** 4, 5, 7

**Priority:** medium

**Description:** The agent chat tab - primary interaction surface.

File: src/components/panel/agent-tab.tsx

Message List:
- Auto-scroll to bottom on new messages
- Agent messages: left-aligned, 24px avatar circle, bg-l200 bubble, max 90% width
- User messages: right-aligned, accent-tinted bubble, max 85% width
- Message text: Figtree 400 14px/1.6 fg-80
- Timestamp: Departure 11px fg-30

Tool Call Indicators (inline):
- 32px height bar, bg-fg-5, border fg-10, radius-md
- Running: Loader2 12px spinning (Spinner component) + 'Running: tool_name' (Figtree 400 12px fg-40)
- Complete: Check 12px green + 'Completed: summary'
- Failed: AlertTriangle 12px red

Typing Indicator:
- 3 dots with typingBounce animation (from Task 3), staggered 0.2s delays

Chat Composer:
- Uses Textarea primitive (auto-resize, min 44px, max 140px)
- Wrapper: bg-l200, radius-sm, border 0.5px fg-5, shadow-inset-025
- Focus: shadow-input-focus
- Send button: Button (primary, sm) with ArrowUp icon, disabled when empty
- Attach button: Button (ghost, sm) with Paperclip icon
- Enter sends, Shift+Enter newline

**Details:**

Messages come from AgentStore. The composer calls AgentStore.addMessage().

All interactive elements use UI primitives:
- Send = Button (primary)
- Attach = Button (ghost)
- Input = Textarea

This ensures the chat looks consistent with the rest of the app.

**Test Strategy:**

1. Messages render with correct alignment (agent left, user right)
2. Auto-scroll works on new message
3. Tool call indicators show correct state icons
4. Typing dots bounce with stagger
5. Composer auto-resizes
6. Enter sends message, Shift+Enter adds newline
7. Send button disabled when textarea empty

## Subtasks

### 16.1. Message list with agent/user bubbles and auto-scroll

**Status:** pending  
**Dependencies:** None  

### 16.2. Tool call indicators (running/complete/failed)

**Status:** pending  
**Dependencies:** None  

### 16.3. Typing indicator with bouncing dots

**Status:** pending  
**Dependencies:** None  

### 16.4. Chat composer with Textarea, Button send/attach, keyboard handling

**Status:** pending  
**Dependencies:** None  

