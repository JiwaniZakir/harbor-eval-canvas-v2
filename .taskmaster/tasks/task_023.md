# Task ID: 23

**Title:** Animation Keyframes Library

**Status:** pending

**Dependencies:** 1

**Priority:** medium

**Description:** Complete set of CSS keyframes referenced throughout the app.

Add to globals.css:

- @keyframes pulseGlow: 0%/100% box-shadow 0 0 0 transparent, 50% box-shadow 0 0 12px accent/20%
- @keyframes dotPulse: 0%/100% scale(1) opacity(0.6), 50% scale(1.3) opacity(1)
- @keyframes shimmer: 0% bg-position -200%, 100% bg-position 200%
- @keyframes sd-slideUp: from translateY(4px) opacity(0), to translateY(0) opacity(1)
- @keyframes sd-fadeIn: from opacity(0), to opacity(1)
- @keyframes cursorBlink: 0%,50% opacity(1), 51%,100% opacity(0)
- @keyframes typingBounce: 0%,60%,100% translateY(0) opacity(0.3), 30% translateY(-4px) opacity(1)
- @keyframes dashScroll: to stroke-dashoffset(-9)
- @keyframes spin: to rotate(360deg)
- @keyframes progress-fill: from width(0)
- @keyframes toast-countdown: from width(100%), to width(0)
- @keyframes skeleton-shimmer: linear-gradient sweep
- @keyframes fanout-entrance: from scale(0.95) opacity(0), to scale(1) opacity(1)

**Details:**

Complete set of CSS keyframes referenced throughout the app.

Add to globals.css:

- @keyframes pulseGlow: 0%/100% box-shadow 0 0 0 transparent, 50% box-shadow 0 0 12px accent/20%
- @keyframes dotPulse: 0%/100% scale(1) opacity(0.6), 50% scale(1.3) opacity(1)
- @keyframes shimmer: 0% bg-position -200%, 100% bg-position 200%
- @keyframes sd-slideUp: from translateY(4px) opacity(0), to translateY(0) opacity(1)
- @keyframes sd-fadeIn: from opacity(0), to opacity(1)
- @keyframes cursorBlink: 0%,50% opacity(1), 51%,100% opacity(0)
- @keyframes typingBounce: 0%,60%,100% translateY(0) opacity(0.3), 30% translateY(-4px) opacity(1)
- @keyframes dashScroll: to stroke-dashoffset(-9)
- @keyframes spin: to rotate(360deg)
- @keyframes progress-fill: from width(0)
- @keyframes toast-countdown: from width(100%), to width(0)
- @keyframes skeleton-shimmer: linear-gradient sweep
- @keyframes fanout-entrance: from scale(0.95) opacity(0), to scale(1) opacity(1)

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 23.1. Add all keyframe definitions to globals.css

**Status:** pending  
**Dependencies:** None  

### 23.2. Verify all keyframes are referenced by components

**Status:** pending  
**Dependencies:** None  

