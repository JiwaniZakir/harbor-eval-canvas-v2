# Task ID: 21

**Title:** Panel Tab Routing: Wire Detail Panel to All 5 Tab Components

**Status:** pending

**Dependencies:** 15, 16, 18, 19, 20

**Priority:** high

**Description:** Update detail-panel.tsx to route UIStore.activeTab to real tab components.

Routing:
- 'home' → <HomeTab />
- 'agent' → <AgentTab />
- 'project' → <ProjectTab />
- 'files' → <FilesTab />
- 'sweeps' → <SweepsTab />

Suspense boundaries with tab-specific skeleton fallbacks.
Domain context: when focusedDomainId is set, tabs show domain-scoped data.

**Details:**

This is the integration task that connects all 5 tab implementations to the panel shell.

Each tab should be wrapped in React.lazy() for code splitting, with Suspense fallback showing the appropriate skeleton layout.

**Test Strategy:**

1. All 5 tabs render when selected
2. Tab switching is instant (no flash)
3. Skeleton shows briefly on first load
4. Tab content updates when domain changes

## Subtasks

### 21.1. Tab routing switch in detail-panel.tsx

**Status:** pending  
**Dependencies:** None  

### 21.2. Suspense boundaries with skeleton fallbacks

**Status:** pending  
**Dependencies:** None  

