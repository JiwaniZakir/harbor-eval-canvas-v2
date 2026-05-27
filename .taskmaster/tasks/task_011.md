# Task ID: 11

**Title:** Agent Tab: Chat Messages + Composer + Tool Indicators

**Status:** pending

**Dependencies:** 2, 3

**Priority:** medium

**Description:** Agent chat tab - the primary interaction surface.

File: src/components/panel/agent-tab.tsx

Message List:
- Auto-scroll to bottom on new messages
- Agent messages: left-aligned, 24px avatar circle (bot icon), bg-l200 bubble, max-width 90%
- User messages: right-aligned, accent-tinted bubble, max-width 85%
- Message text: Figtree 400 14px/1.6 fg-80
- Timestamp: Departure 11px fg-30

Tool Call Indicators (inline):
- 32px height bar within message flow
- Running: Loader2 12px spinning + 'Running: tool_name' (Figtree 400 12px fg-40)
- Complete: Check 12px green + 'Completed: summary'
- Failed: AlertTriangle 12px red

Typing Indicator:
- 3 dots with bounce animation (typingBounce 1.4s, staggered delays)
- Shows when agent is processing

Chat Composer (bottom-fixed within tab):
- Auto-resize textarea (min 44px, max 140px)
- Wrapper: bg-l200, radius-sm, border 0.5px fg-5, shadow-inset-025
- Focus: shadow-input-focus, border fg-10
- Placeholder: 'Ask about this evaluation...' (fg-30)
- Send button: 28px, accent bg, white ArrowUp icon, disabled when empty
- Attach button: 28px, fg-40, Paperclip icon
- Enter sends, Shift+Enter newline

**Details:**

Agent chat tab - the primary interaction surface.

File: src/components/panel/agent-tab.tsx

Message List:
- Auto-scroll to bottom on new messages
- Agent messages: left-aligned, 24px avatar circle (bot icon), bg-l200 bubble, max-width 90%
- User messages: right-aligned, accent-tinted bubble, max-width 85%
- Message text: Figtree 400 14px/1.6 fg-80
- Timestamp: Departure 11px fg-30

Tool Call Indicators (inline):
- 32px height bar within message flow
- Running: Loader2 12px spinning + 'Running: tool_name' (Figtree 400 12px fg-40)
- Complete: Check 12px green + 'Completed: summary'
- Failed: AlertTriangle 12px red

Typing Indicator:
- 3 dots with bounce animation (typingBounce 1.4s, staggered delays)
- Shows when agent is processing

Chat Composer (bottom-fixed within tab):
- Auto-resize textarea (min 44px, max 140px)
- Wrapper: bg-l200, radius-sm, border 0.5px fg-5, shadow-inset-025
- Focus: shadow-input-focus, border fg-10
- Placeholder: 'Ask about this evaluation...' (fg-30)
- Send button: 28px, accent bg, white ArrowUp icon, disabled when empty
- Attach button: 28px, fg-40, Paperclip icon
- Enter sends, Shift+Enter newline

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 11.1. Message list with agent/user bubble styles and auto-scroll

**Status:** pending  
**Dependencies:** None  

### 11.2. Tool call indicator bars (running/complete/failed)

**Status:** pending  
**Dependencies:** None  

### 11.3. Typing indicator with bouncing dots

**Status:** pending  
**Dependencies:** None  

### 11.4. Chat composer with auto-resize textarea and send/attach buttons

**Status:** pending  
**Dependencies:** None  

### 11.5. Enter to send, Shift+Enter for newline

**Status:** pending  
**Dependencies:** None  

