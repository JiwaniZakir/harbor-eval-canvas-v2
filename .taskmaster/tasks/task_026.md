# Task ID: 26

**Title:** Streaming Text + Markdown Renderer

**Status:** pending

**Dependencies:** 2, 3

**Priority:** medium

**Description:** Character-by-character streaming and markdown for agent messages.

File: src/components/ui/streaming-text.tsx

StreamingText:
- rAF-based character reveal, speed prop (12ms default)
- Blinking cursor: 2px × 1em, fg-40, cursorBlink keyframe
- Respects prefers-reduced-motion

StreamingMarkdown:
- Renders blocks as they arrive
- Auto-scrolls during streaming

Markdown renderer (zero deps):
- Code blocks → <pre class='md-code-block'>
- Inline code → <code class='md-inline-code'>
- Bold, italic, headers, lists

CSS in globals.css:
- .agent-prose: Figtree 400 14px/1.6 fg-80
- .md-code-block: fg-5 bg, fg-10 border, mono 12px
- .md-inline-code: fg-5 bg, radius-xs, padding 2px 5px

**Details:**

Used in the Agent tab for rendering agent responses. The streaming effect creates a premium feel.

**Test Strategy:**

1. Text reveals character by character
2. Cursor blinks at end
3. Markdown renders correctly (bold, code, headers)
4. Reduced motion shows all text immediately

## Subtasks

### 26.1. StreamingText with rAF character reveal and cursor

**Status:** pending  
**Dependencies:** None  

### 26.2. StreamingMarkdown with auto-scroll

**Status:** pending  
**Dependencies:** None  

### 26.3. simpleMarkdown renderer (no deps)

**Status:** pending  
**Dependencies:** None  

### 26.4. CSS for prose, code blocks, inline code

**Status:** pending  
**Dependencies:** None  

