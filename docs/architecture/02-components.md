# 02 - Component Inventory & Layout Architecture

> Every component in the platform with file paths, props, and priority.

---

## Layout Architecture

```
┌─────────────────────────────────────────────────────────┐
│  TopBar (h-14, fixed)                                   │
│  [Logo] [Project Name] [Model Selector] [Progress] [⌘] │
├──────────────────────────┬──────────────┬───────────────┤
│                          │              │               │
│    Canvas (flex-1)       │ Detail Panel │  Companion    │
│                          │  (0-480px)   │   (400px)     │
│  ┌─────────────────┐     │              │               │
│  │  Center Model   │     │  Domain info │  Chat         │
│  │     Node        │     │  Milestones  │  Tool calls   │
│  │                 │     │  Task detail │  Plans        │
│  │  Domain Nodes   │     │  Artifacts   │  Approvals    │
│  │  (radial ring)  │     │  Probe data  │               │
│  │                 │     │  Sweep data  │               │
│  └─────────────────┘     │              │               │
│                          │              │               │
│  [MiniMap]               │              │               │
├──────────────────────────┴──────────────┴───────────────┤
│  StatusBar (h-8, fixed)                                 │
│  [Agent Status] [Domain Progress] [Keyboard Hints]      │
└─────────────────────────────────────────────────────────┘
```

- **Canvas**: Takes remaining space. @xyflow/react handles panning/zooming.
- **Detail Panel**: Slides in from right, 0-480px. Shows domain/milestone/task details.
- **Companion**: Right edge, 400px fixed width. Chat interface with agent.
- **Both panels can be independently open/closed**. Canvas resizes accordingly.

---

## Component Inventory

### Tier 1: Core Layout (Sprint 1)

| Component | File Path | Description |
|-----------|-----------|-------------|
| `RootLayout` | `app/layout.tsx` | HTML shell, font loading, providers |
| `WorkspacePage` | `app/page.tsx` | Main page, store hydration, keyboard shortcuts |
| `TopBar` | `components/layout/top-bar.tsx` | Fixed header with project info |
| `StatusBar` | `components/layout/status-bar.tsx` | Bottom bar with agent status |
| `CanvasShell` | `components/canvas/canvas-shell.tsx` | @xyflow/react wrapper, providers |
| `CompanionPanel` | `components/companion/companion-panel.tsx` | Chat panel shell |
| `DetailPanel` | `components/layout/detail-panel.tsx` | Slide-in detail panel shell |

### Tier 2: Canvas Nodes (Sprint 1-2)

| Component | File Path | Props |
|-----------|-----------|-------|
| `CenterModelNode` | `components/canvas/center-model-node.tsx` | `{ data: CenterModelNodeData }` |
| `DomainNode` | `components/canvas/domain-node.tsx` | `{ data: DomainNodeData }` |
| `MilestoneNode` | `components/canvas/milestone-node.tsx` | `{ data: MilestoneNodeData }` |
| `AgentActivityNode` | `components/canvas/agent-activity-node.tsx` | `{ data: AgentActivityNodeData }` |
| `DomainEdge` | `components/canvas/domain-edge.tsx` | `{ data: DomainConnectionData }` |
| `DependencyEdge` | `components/canvas/dependency-edge.tsx` | Cross-domain dependency line |
| `CanvasMiniMap` | `components/canvas/canvas-minimap.tsx` | Custom styled minimap |
| `CanvasControls` | `components/canvas/canvas-controls.tsx` | Zoom/fit/layout controls |

### Tier 3: Domain & Milestone (Sprint 2)

| Component | File Path | Description |
|-----------|-----------|-------------|
| `DomainDetailView` | `components/domain/domain-detail-view.tsx` | Full domain panel content |
| `DomainHeader` | `components/domain/domain-header.tsx` | Domain icon, name, status badge |
| `RoadmapStrip` | `components/domain/roadmap-strip.tsx` | Horizontal milestone roadmap |
| `MilestoneCard` | `components/milestone/milestone-card.tsx` | 248x72px milestone card |
| `MilestoneConnector` | `components/milestone/milestone-connector.tsx` | Dashed connector between cards |
| `MilestoneDetail` | `components/milestone/milestone-detail.tsx` | Expanded milestone info |
| `SuggestedProbesPanel` | `components/domain/suggested-probes.tsx` | AI-suggested next probes |
| `DomainProgressBar` | `components/domain/domain-progress-bar.tsx` | Domain completion bar |
| `CrossDomainDeps` | `components/domain/cross-domain-deps.tsx` | Cross-domain dependency viewer |

### Tier 4: Agent & Companion (Sprint 2-3)

| Component | File Path | Description |
|-----------|-----------|-------------|
| `ChatThread` | `components/companion/chat-thread.tsx` | Message list with auto-scroll |
| `ChatMessage` | `components/companion/chat-message.tsx` | Single message bubble |
| `ChatComposer` | `components/companion/chat-composer.tsx` | Input with slash commands |
| `ToolCallCard` | `components/companion/tool-call-card.tsx` | Expandable tool call display |
| `PlanDisplay` | `components/companion/plan-display.tsx` | Step-by-step plan view |
| `ApprovalGate` | `components/companion/approval-gate.tsx` | Approve/reject inline card |
| `AgentStatusIndicator` | `components/companion/agent-status.tsx` | Pulsing status dot + label |

### Tier 5: Task & Results (Sprint 3)

| Component | File Path | Description |
|-----------|-----------|-------------|
| `TaskDetailView` | `components/studio/task-detail-view.tsx` | Full task panel content |
| `ArtifactViewer` | `components/studio/artifact-viewer.tsx` | Code/markdown viewer |
| `ArtifactTabs` | `components/studio/artifact-tabs.tsx` | Tab bar for task artifacts |
| `ProbeResultsChart` | `components/studio/probe-results-chart.tsx` | Failure rate bar chart |
| `SweepTrialCard` | `components/studio/sweep-trial-card.tsx` | Individual sweep trial |
| `SweepProgress` | `components/studio/sweep-progress.tsx` | Sweep progress display |
| `WeaknessCardView` | `components/studio/weakness-card.tsx` | Weakness card display |
| `DecisionReport` | `components/studio/decision-report.tsx` | Probe decision table |

### Tier 6: Modals & Overlays (Sprint 3-4)

| Component | File Path | Description |
|-----------|-----------|-------------|
| `CommandPalette` | `components/studio/command-palette.tsx` | ⌘K command palette |
| `PublishDialog` | `components/studio/publish-dialog.tsx` | Publish confirmation |
| `ModelSelector` | `components/studio/model-selector.tsx` | Target model picker |
| `ProjectSetupWizard` | `components/studio/project-setup.tsx` | New project wizard |
| `NoticeStack` | `components/layout/notice-stack.tsx` | Toast notifications |

### Tier 7: UI Primitives (Sprint 1, ongoing)

| Component | File Path | Description |
|-----------|-----------|-------------|
| `Button` | `components/ui/button.tsx` | CVA-based button |
| `Badge` | `components/ui/badge.tsx` | Status badges |
| `Card` | `components/ui/card.tsx` | Container card |
| `Input` | `components/ui/input.tsx` | Text input |
| `Textarea` | `components/ui/textarea.tsx` | Multi-line input |
| `ScrollArea` | `components/ui/scroll-area.tsx` | Radix scroll area |
| `Tabs` | `components/ui/tabs.tsx` | Radix tabs |
| `Tooltip` | `components/ui/tooltip.tsx` | Radix tooltip |
| `Dialog` | `components/ui/dialog.tsx` | Radix dialog |
| `DropdownMenu` | `components/ui/dropdown-menu.tsx` | Radix dropdown |
| `Progress` | `components/ui/progress.tsx` | Progress bar |
| `Separator` | `components/ui/separator.tsx` | Visual separator |
| `Switch` | `components/ui/switch.tsx` | Toggle switch |
| `Skeleton` | `components/ui/skeleton.tsx` | Loading skeleton |
| `Spinner` | `components/ui/spinner.tsx` | Loading spinner |

---

## Interaction Flows

### 1. Project Initialization
1. User opens app -> sees `ProjectSetupWizard`
2. Picks target model, names project
3. Canvas renders with center model + 8 domain nodes in radial layout
4. Default roadmap milestones populate for each domain
5. "Suggested Next" panel shows 3 recommended starting probes

### 2. Domain Exploration
1. Click domain node on canvas -> node expands, detail panel slides in
2. Detail panel shows: domain description, roadmap strip, milestone list
3. Each milestone card shows status, prerequisites, and probe strategy
4. Click milestone -> focus shifts, agent companion activates for that milestone

### 3. Milestone Probing
1. User clicks "Start Probe" on a milestone (or agent suggests it)
2. Agent companion opens, begins intake for the weakness card
3. Agent runs 5 probe variants, streams results
4. Approval gate: user reviews probe summary, approves promote/redesign/reject
5. Milestone status transitions through probing -> building -> validating

### 4. Canvas Live Updates
1. Agent activity nodes appear next to active domains
2. Domain edge colors pulse based on activity
3. Milestone status badges update in real-time
4. Cross-domain dependency edges light up when milestones complete

### 5. Cross-Domain Dependencies
1. Completing INSTRUCTION_CONSTRAINT unlocks MULTILINGUAL_TRANSFER
2. Dependency edge animates: glow + checkmark on source, unlock on target
3. Target milestone transitions from "locked" to "available"
4. "Suggested Next" refreshes to include newly unlocked milestones
