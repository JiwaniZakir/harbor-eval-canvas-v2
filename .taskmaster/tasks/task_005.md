# Task ID: 5

**Title:** TypeScript Types + Zustand State Stores

**Status:** pending

**Dependencies:** 1

**Priority:** high

**Description:** All TypeScript interfaces and 4 Zustand stores. This defines the data model for the entire app.

File: src/lib/types.ts
- DomainId: 'instruction_following' | 'reasoning_logic' | 'safety_alignment' | 'knowledge_factuality' | 'calibration_uncertainty' | 'multilinguality' | 'long_context' | 'tool_use_agency'
- DomainStatus: 22-state union type (untested | probe_queued | probing | probe_complete | promoted | redesign | rejected | scaffold_queued | scaffolding | scaffold_complete | validation_gate | gate_passed | gate_failed | target_sweep | sweep_complete | iterating | published | ready_to_publish | calibrating | needs_review | blocked | archived)
- GlobalState: 'empty' | 'onboarding' | 'canvas_idle' | 'probing' | 'scaffolding' | 'validating' | 'calibrating' | 'published'
- TabId: 'home' | 'agent' | 'project' | 'files' | 'sweeps'
- ToolName: string union of all tool names
- ToolCallStatus: 'queued' | 'running' | 'succeeded' | 'failed'
- ToolCall: { id, name, args, status, result?, summary?, startedAt, finishedAt? }
- PlanStep: { id, label, status }
- ChatMessage: { id, role, content, timestamp, toolCalls? }
- ProbeSummary: { weaknessTitle, variants[], aggregateFailureRate?, verdict }
- SweepTrial: { idx, reward, status, summary }
- SweepSummary: { taskSlug, passAt3, trials[] }
- DomainState: { id, status, artifacts[], probeSummary?, sweepSummary?, progress }
- Project: { name, targetModel, globalProgress, createdAt }
- TargetModel: { provider, modelSlug, modelName }

File: src/lib/stores/project-store.ts
- State: { project: Project | null }
- Actions: setProject, updateProgress, setTargetModel, resetProject
- Persist: localStorage with 'harbor-project' key

File: src/lib/stores/domain-store.ts
- State: { domainStates: Record<DomainId, DomainState> }
- Actions: setDomainStatus, addArtifact, setProbeSummary, setSweepSummary, initializeDomains, resetDomains
- Initialize: all 8 domains with status 'untested'
- Persist: localStorage with 'harbor-domains' key

File: src/lib/stores/ui-store.ts
- State: { activeTab: TabId, focusedDomainId: DomainId | null, detailPanel: {open, kind, domainId?}, setupWizardOpen: boolean, globalState: GlobalState, commandPaletteOpen: boolean }
- Actions: setActiveTab, setFocusedDomain, openDetailPanel, closeDetailPanel, setSetupWizardOpen, setGlobalState, toggleCommandPalette
- Computed: panelShouldShow (based on globalState)

File: src/lib/stores/agent-store.ts
- State: { messages: ChatMessage[], isStreaming: boolean, currentToolCalls: ToolCall[] }
- Actions: addMessage, updateMessage, setStreaming, addToolCall, updateToolCall, clearMessages

**Details:**

The stores use Zustand with persist middleware for project-store and domain-store. UI store does NOT persist (tab state resets on page load). Agent store does NOT persist (messages are session-only in MVP).

All store actions must be properly typed. Use TypeScript generics with Zustand's create<State>() pattern.

**Test Strategy:**

1. Import all types - no TypeScript errors
2. All stores initialize with correct defaults
3. project-store persists to localStorage and rehydrates
4. domain-store initializes 8 domains with 'untested' status
5. ui-store.setActiveTab updates and bottom nav reflects change

## Subtasks

### 5.1. Create src/lib/types.ts with ALL interfaces and type unions

**Status:** pending  
**Dependencies:** None  

### 5.2. Create project-store.ts with localStorage persistence

**Status:** pending  
**Dependencies:** None  

### 5.3. Create domain-store.ts with 8 domain initialization and persistence

**Status:** pending  
**Dependencies:** None  

### 5.4. Create ui-store.ts with global state machine and tab management

**Status:** pending  
**Dependencies:** None  

### 5.5. Create agent-store.ts with message and tool call management

**Status:** pending  
**Dependencies:** None  

