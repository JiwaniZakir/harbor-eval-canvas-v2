# Task ID: 2

**Title:** Page Layout Shell: Top Bar + Canvas Area + Panel + Bottom Nav

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** Create the root page layout with all 4 zones. This sets the spatial framework for the entire app.

Files to create:
- src/app/page.tsx: Root page composing all layout zones
- src/app/layout.tsx: HTML shell with fonts, metadata
- src/components/layout/top-bar.tsx
- src/components/layout/bottom-nav.tsx
- src/components/layout/detail-panel.tsx
- src/components/canvas/canvas-shell.tsx

Top Bar (48px fixed):
- Left: 28px avatar circle (initials ZJ, bg-l0, fg-5 border, Figtree 600 11px) + project name dropdown (Figtree 500 14px fg-80, ChevronDown 10px fg-30, hover rotates chevron)
- Dropdown: 240px, bg-l200, radius-lg, shadow-outset-150, items with checkmark for current project + 'New Project' with Plus icon
- Breadcrumb: Shows when domain focused - ChevronRight separators, domain name (Figtree 500 13px fg-50) + stage (Figtree 400 12px fg-30)
- Right: Model pill (28px height, Departure 12px, 6px provider dot) + Settings gear (32px square, Settings icon 18px)

Bottom Nav (56px + safe area):
- 5 tabs evenly spaced: Home(House), Agent(MessageCircle), Project(FolderKanban), Files(FileCode2), Sweeps(BarChart3)
- Each: 44px touch target, icon 20px centered, label below (Figtree 400 10px)
- Active: fg-80 + 2px accent underline. Inactive: fg-40
- Badge dot on Sweeps: 6px accent circle, absolute top-right of icon

Right Panel (360px):
- Tab strip header: 36px, 5 text tabs, active underline indicator
- Scrollable content area with 16px padding
- Synced with bottom nav via shared UIStore.activeTab

Canvas Shell:
- Flex-1 remaining space, centered content, bg-l0

**Details:**

Create the root page layout with all 4 zones. This sets the spatial framework for the entire app.

Files to create:
- src/app/page.tsx: Root page composing all layout zones
- src/app/layout.tsx: HTML shell with fonts, metadata
- src/components/layout/top-bar.tsx
- src/components/layout/bottom-nav.tsx
- src/components/layout/detail-panel.tsx
- src/components/canvas/canvas-shell.tsx

Top Bar (48px fixed):
- Left: 28px avatar circle (initials ZJ, bg-l0, fg-5 border, Figtree 600 11px) + project name dropdown (Figtree 500 14px fg-80, ChevronDown 10px fg-30, hover rotates chevron)
- Dropdown: 240px, bg-l200, radius-lg, shadow-outset-150, items with checkmark for current project + 'New Project' with Plus icon
- Breadcrumb: Shows when domain focused - ChevronRight separators, domain name (Figtree 500 13px fg-50) + stage (Figtree 400 12px fg-30)
- Right: Model pill (28px height, Departure 12px, 6px provider dot) + Settings gear (32px square, Settings icon 18px)

Bottom Nav (56px + safe area):
- 5 tabs evenly spaced: Home(House), Agent(MessageCircle), Project(FolderKanban), Files(FileCode2), Sweeps(BarChart3)
- Each: 44px touch target, icon 20px centered, label below (Figtree 400 10px)
- Active: fg-80 + 2px accent underline. Inactive: fg-40
- Badge dot on Sweeps: 6px accent circle, absolute top-right of icon

Right Panel (360px):
- Tab strip header: 36px, 5 text tabs, active underline indicator
- Scrollable content area with 16px padding
- Synced with bottom nav via shared UIStore.activeTab

Canvas Shell:
- Flex-1 remaining space, centered content, bg-l0

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 2.1. Create src/app/layout.tsx with font loading and metadata

**Status:** pending  
**Dependencies:** None  

### 2.2. Create src/app/page.tsx composing all layout zones

**Status:** pending  
**Dependencies:** None  

### 2.3. Build top-bar.tsx with avatar, project dropdown, model pill, settings gear

**Status:** pending  
**Dependencies:** None  

### 2.4. Build bottom-nav.tsx with 5 tabs, active states, badge dot

**Status:** pending  
**Dependencies:** None  

### 2.5. Build detail-panel.tsx shell with tab strip and scrollable content

**Status:** pending  
**Dependencies:** None  

### 2.6. Build canvas-shell.tsx as flex-1 centered container

**Status:** pending  
**Dependencies:** None  

### 2.7. Add top bar breadcrumb (domain > stage) when domain is focused

**Status:** pending  
**Dependencies:** None  

### 2.8. Wire bottom nav and panel tabs to shared UIStore.activeTab

**Status:** pending  
**Dependencies:** None  

