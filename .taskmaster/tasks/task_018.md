# Task ID: 18

**Title:** Project Tab: Settings + Model Chips + Danger Zone

**Status:** pending

**Dependencies:** 4, 5, 7

**Priority:** medium

**Description:** Project settings tab.

File: src/components/panel/project-tab.tsx

Settings Sections:
- Section header: Figtree 600 13px fg-60, uppercase, letter-spacing 0.04em
- Key-value rows: label (Figtree 400 13px fg-50) + value (Figtree 500 13px fg-80)

Model Chips:
- Primary: Badge (accent) with star icon
- Secondary: Badge (default)
- Add: dashed border Badge with Plus icon

Danger Zone:
- Red text links for 'Reset Project', 'Delete All Data'
- Click opens Dialog (from UI primitives) with:
  - Warning text
  - 'Cancel' Button (secondary) + 'Confirm' Button (danger)
  - Overlay with blur

DESIGN CONSISTENCY: Uses Badge for chips, Dialog for confirmation, Button for actions.

**Details:**

Settings data comes from ProjectStore. Model changes update ProjectStore.setTargetModel().

The danger zone confirmation Dialog uses the Dialog primitive with red CTA Button (danger variant).

**Test Strategy:**

1. Settings show correct project data
2. Model chips display with correct styling
3. Danger link opens confirmation Dialog
4. Cancel closes dialog without action
5. Confirm executes destructive action and closes

## Subtasks

### 18.1. Settings sections with key-value rows

**Status:** pending  
**Dependencies:** None  

### 18.2. Model chips using Badge primitive

**Status:** pending  
**Dependencies:** None  

### 18.3. Danger zone with Dialog confirmation

**Status:** pending  
**Dependencies:** None  

