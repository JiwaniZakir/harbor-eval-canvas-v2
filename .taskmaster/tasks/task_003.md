# Task ID: 3

**Title:** Animation Keyframes Library

**Status:** pending

**Dependencies:** 2

**Priority:** high

**Description:** All CSS keyframes used throughout the app. Created early so every component can reference them.

Add to globals.css AFTER design tokens:

@keyframes pulseGlow { 0%,100% { box-shadow: 0 0 0 0 transparent; } 50% { box-shadow: 0 0 12px 0 var(--domain-accent, rgba(99,102,241,0.2)); } }
@keyframes dotPulse { 0%,100% { transform: scale(1); opacity: 0.6; } 50% { transform: scale(1.3); opacity: 1; } }
@keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
@keyframes sd-slideUp { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: translateY(0); } }
@keyframes sd-fadeIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes cursorBlink { 0%,50% { opacity: 1; } 51%,100% { opacity: 0; } }
@keyframes typingBounce { 0%,60%,100% { transform: translateY(0); opacity: 0.3; } 30% { transform: translateY(-4px); opacity: 1; } }
@keyframes dashScroll { to { stroke-dashoffset: -9; } }
@keyframes spin { to { transform: rotate(360deg); } }
@keyframes progress-fill { from { width: 0; } }
@keyframes toast-countdown { from { width: 100%; } to { width: 0; } }
@keyframes fanout-entrance { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
@keyframes skeleton-shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }

**Details:**

These keyframes are referenced by: radial ring nodes (pulseGlow, dotPulse), onboarding (shimmer), dropdowns/modals (sd-slideUp, sd-fadeIn), streaming text (cursorBlink), agent chat (typingBounce), connection lines (dashScroll), loaders (spin), progress bars (progress-fill), toasts (toast-countdown), fan-out cards (fanout-entrance), skeletons (skeleton-shimmer).

Creating them all upfront ensures no component fails to animate.

**Test Strategy:**

1. All keyframe names compile without CSS errors
2. Test element with animation: pulseGlow 2s infinite renders correctly
3. Reduced motion media query disables all animations

## Subtasks

### 3.1. Add all 13 @keyframes definitions to globals.css

**Status:** pending  
**Dependencies:** None  

### 3.2. Verify each keyframe is syntactically correct

**Status:** pending  
**Dependencies:** None  

