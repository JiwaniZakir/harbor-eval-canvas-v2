# Task ID: 7

**Title:** Page Layout: Top Bar + Canvas Area + Right Panel + Bottom Nav

**Status:** pending

**Dependencies:** 2, 4, 5

**Priority:** high

**Description:** The root page layout with all 4 spatial zones. Uses design tokens from Task 2 and primitives from Task 4.

Files:
- src/app/page.tsx: Root page composing all zones
- src/components/layout/top-bar.tsx: Fixed 48px header
- src/components/layout/bottom-nav.tsx: Fixed 56px footer
- src/components/layout/detail-panel.tsx: Fixed 360px right panel
- src/components/canvas/canvas-shell.tsx: Flex-1 center area

Top Bar (spec §0.2):
- 28px avatar circle (bg-l0, fg-5 border, Figtree 600 11px initials 'ZJ')
- Project name dropdown (Figtree 500 14px fg-80, ChevronDown 10px)
- Dropdown menu (240px, bg-l200, radius-lg, shadow-outset-150, sd-slideUp animation)
- Breadcrumb when domain focused: ChevronRight + domain name (Figtree 500 13px fg-50) + stage (Figtree 400 12px fg-30)
- Right: Model pill (Departure 12px, provider dot 6px) + Settings gear (32px, 18px icon)

Bottom Nav (spec §0.3):
- 5 tabs: Home(House), Agent(MessageCircle), Project(FolderKanban), Files(FileCode2), Sweeps(BarChart3)
- Tab: 44px touch target, 20px icon, Figtree 400 10px label
- Active: fg-80 + 2px accent underline. Inactive: fg-40
- Badge dot on Sweeps: 6px accent circle
- Reads UIStore.activeTab, writes UIStore.setActiveTab

Detail Panel (spec §0.4):
- 360px width, bg-l100, border-left fg-5
- Tab strip: 36px height, 5 text labels, active underline matching bottom nav
- Scrollable content area, 16px padding
- Reads UIStore.activeTab for content routing

Canvas Shell:
- Flex-1 remaining space, centered content, bg-l0
- Contains either: empty state, onboarding wizard, or radial ring

**Details:**

CRITICAL: Bottom nav and panel tab strip MUST share UIStore.activeTab. Clicking bottom nav tab OR panel tab updates the same state. This is the primary navigation mechanism.

All CSS must use design tokens from Task 2. No hardcoded colors.

The top bar model pill uses Departure font for the model name, with a 6px dot colored by provider:
- google: #4285F4
- anthropic: #D4A574
- openai: #10A37F

**Test Strategy:**

1. All 4 zones render at correct positions and sizes
2. Bottom nav tab click updates panel content
3. Panel tab click updates bottom nav active state
4. Top bar dropdown opens/closes correctly
5. Model pill shows correct provider dot color
6. Mobile: panel hidden, full-width canvas
7. Breadcrumb appears when domain is focused

## Subtasks

### 7.1. Build top-bar.tsx with avatar, project dropdown, model pill, settings, breadcrumb

**Status:** pending  
**Dependencies:** None  

### 7.2. Build bottom-nav.tsx with 5 tabs synced to UIStore.activeTab

**Status:** pending  
**Dependencies:** None  

### 7.3. Build detail-panel.tsx shell with tab strip header

**Status:** pending  
**Dependencies:** None  

### 7.4. Build canvas-shell.tsx as centered flex container

**Status:** pending  
**Dependencies:** None  

### 7.5. Compose all zones in page.tsx with correct CSS grid/flex

**Status:** pending  
**Dependencies:** None  

### 7.6. Add CSS for all layout components to globals.css

**Status:** pending  
**Dependencies:** None  

