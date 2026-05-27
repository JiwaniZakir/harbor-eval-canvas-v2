# Task ID: 19

**Title:** Streaming Text Display + Markdown Renderer

**Status:** pending

**Dependencies:** 1

**Priority:** medium

**Description:** Character-by-character streaming and markdown rendering for agent messages.

File: src/components/ui/streaming-text.tsx

StreamingText component:
- Props: text, speed (ms per char, default 12), onComplete
- Uses requestAnimationFrame for smooth rendering
- Blinking cursor at end (2px wide, fg-40, cursorBlink 1s step-end)
- Respects prefers-reduced-motion (shows all immediately)

StreamingMarkdown component:
- Renders complete blocks as they stream in
- Auto-scrolls to bottom during streaming

Markdown renderer (no external deps):
- Code blocks: ```lang → <pre class='md-code-block'>
- Inline code: `text` → <code class='md-inline-code'>
- Bold: **text** → <strong>
- Italic: *text* → <em>
- Headers: # ## ### → h2 h3 h4 with Figtree sizing
- Lists: - item → <li>
- Line breaks: \n\n → paragraph breaks

CSS for prose:
- .agent-prose: Figtree 400 14px/1.6 fg-80
- Code block: fg-5 bg, fg-10 border, mono 12px
- Inline code: fg-5 bg, radius-xs, padding 2px 5px

**Details:**

Character-by-character streaming and markdown rendering for agent messages.

File: src/components/ui/streaming-text.tsx

StreamingText component:
- Props: text, speed (ms per char, default 12), onComplete
- Uses requestAnimationFrame for smooth rendering
- Blinking cursor at end (2px wide, fg-40, cursorBlink 1s step-end)
- Respects prefers-reduced-motion (shows all immediately)

StreamingMarkdown component:
- Renders complete blocks as they stream in
- Auto-scrolls to bottom during streaming

Markdown renderer (no external deps):
- Code blocks: ```lang → <pre class='md-code-block'>
- Inline code: `text` → <code class='md-inline-code'>
- Bold: **text** → <strong>
- Italic: *text* → <em>
- Headers: # ## ### → h2 h3 h4 with Figtree sizing
- Lists: - item → <li>
- Line breaks: \n\n → paragraph breaks

CSS for prose:
- .agent-prose: Figtree 400 14px/1.6 fg-80
- Code block: fg-5 bg, fg-10 border, mono 12px
- Inline code: fg-5 bg, radius-xs, padding 2px 5px

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 19.1. StreamingText with rAF-based character reveal and cursor

**Status:** pending  
**Dependencies:** None  

### 19.2. StreamingMarkdown with auto-scroll

**Status:** pending  
**Dependencies:** None  

### 19.3. simpleMarkdown renderer (no deps)

**Status:** pending  
**Dependencies:** None  

### 19.4. CSS for agent prose, code blocks, inline code

**Status:** pending  
**Dependencies:** None  

