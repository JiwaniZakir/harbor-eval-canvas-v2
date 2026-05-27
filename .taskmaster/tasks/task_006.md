# Task ID: 6

**Title:** SVG Assets: Pipeline Icons + Domain Icons

**Status:** pending

**Dependencies:** None

**Priority:** medium

**Description:** Create all SVG icon assets before any component that references them.

Directory: public/eval-icons/

5 Pipeline Stage Icons (24x24, stroke-based, 1.5px, currentColor, round caps):
- intake.svg: Inbox/funnel shape
- probe.svg: Magnifying glass with crosshair
- scaffold.svg: Building blocks / layers
- validate.svg: Shield with checkmark
- publish.svg: Rocket / share arrow

8 Domain Icons (24x24, same style):
- instruction.svg: Document with arrow
- reasoning.svg: Brain / logic gate
- safety.svg: Shield
- knowledge.svg: Book / database
- multilingual.svg: Globe with text
- code.svg: Code brackets <>
- creativity.svg: Sparkle / star
- multimodal.svg: Image + text layers

**Details:**

All icons must be:
- Exactly 24x24 viewBox
- stroke='currentColor' (inherits color from parent)
- strokeWidth='1.5'
- strokeLinecap='round' strokeLinejoin='round'
- fill='none'
- No embedded styles or classes

This ensures icons adapt to any color context via CSS color property.

**Test Strategy:**

1. All 13 SVGs render at 24px in browser
2. Icons change color when parent color CSS changes
3. No rendering artifacts at small sizes (16px, 12px)

## Subtasks

### 6.1. Create 5 pipeline stage SVGs in public/eval-icons/

**Status:** pending  
**Dependencies:** None  

### 6.2. Create 8 domain SVGs in public/eval-icons/

**Status:** pending  
**Dependencies:** None  

