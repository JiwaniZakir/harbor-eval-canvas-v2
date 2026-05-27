# Task ID: 31

**Title:** Design Consistency Audit: Visual Regression Check

**Status:** pending

**Dependencies:** 8, 9, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21

**Priority:** high

**Description:** Systematic audit of every component to verify consistent use of design tokens.

Check ALL components for:
- Every color is a CSS variable (no hex codes except in token definitions)
- Every border-radius uses --radius-* tokens
- Every shadow uses --shadow-* tokens
- Every font uses --font-* tokens with correct weight/size
- Every interactive element uses UI primitives (Button, Input, Badge, Card, Dialog)
- Every animation uses keyframes from Task 3
- Focus ring works on every interactive element
- Hover/active states exist on every clickable element
- No orphaned CSS classes
- No duplicate style definitions

Fix any inconsistencies found.

**Details:**

This is a VERIFICATION task, not a build task. Run it as a manual audit:
1. grep -r '#[0-9a-fA-F]' in component files (should only be in globals.css)
2. grep for hardcoded px values that should be tokens
3. Verify every Button instance uses the Button primitive
4. Check that Badge, Card, Dialog are used consistently

Document findings and fix all issues.

**Test Strategy:**

1. Zero hardcoded colors in component files
2. Zero hardcoded border-radius outside globals.css
3. All interactive elements have focus ring
4. All clickable elements have hover state
5. npx tsc --noEmit passes clean

## Subtasks

### 31.1. Audit all components for hardcoded colors/values

**Status:** pending  
**Dependencies:** None  

### 31.2. Verify UI primitive usage across all components

**Status:** pending  
**Dependencies:** None  

### 31.3. Fix all inconsistencies found

**Status:** pending  
**Dependencies:** None  

### 31.4. Verify focus ring on every interactive element

**Status:** pending  
**Dependencies:** None  

