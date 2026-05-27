# Task ID: 26

**Title:** Panel Tab Routing: Detail Panel Routes to Real Tab Components

**Status:** pending

**Dependencies:** 2, 10, 11, 12, 13, 14

**Priority:** high

**Description:** Wire the detail panel shell to render actual tab content components.

Update src/components/layout/detail-panel.tsx:
- Read UIStore.activeTab
- Route to: HomeTab, AgentTab, ProjectTab, FilesTab, SweepsTab
- Lazy load tab contents with Suspense + skeleton fallbacks
- Handle domain-specific context (when focusedDomainId is set, tabs show domain-scoped data)

Tab content rendering:
- home → <HomeTab />
- agent → <AgentTab />
- project → <ProjectTab />
- files → <FilesTab />
- sweeps → <SweepsTab />

**Details:**

Wire the detail panel shell to render actual tab content components.

Update src/components/layout/detail-panel.tsx:
- Read UIStore.activeTab
- Route to: HomeTab, AgentTab, ProjectTab, FilesTab, SweepsTab
- Lazy load tab contents with Suspense + skeleton fallbacks
- Handle domain-specific context (when focusedDomainId is set, tabs show domain-scoped data)

Tab content rendering:
- home → <HomeTab />
- agent → <AgentTab />
- project → <ProjectTab />
- files → <FilesTab />
- sweeps → <SweepsTab />

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 26.1. Tab routing switch in detail panel

**Status:** pending  
**Dependencies:** None  

### 26.2. Suspense boundaries with tab-specific skeletons

**Status:** pending  
**Dependencies:** None  

