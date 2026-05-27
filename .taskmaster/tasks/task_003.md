# Task ID: 3

**Title:** Zustand State Stores: Project, Domain, UI, Agent

**Status:** pending

**Dependencies:** None

**Priority:** high

**Description:** Create all 4 Zustand stores with full type definitions.

Files:
- src/lib/types.ts: All TypeScript interfaces
- src/lib/stores/project-store.ts
- src/lib/stores/domain-store.ts
- src/lib/stores/ui-store.ts
- src/lib/stores/agent-store.ts

Types (src/lib/types.ts):
- DomainId: union of 8 domain string literals
- DomainStatus: 22-state union (untested, probe_queued, probing, probe_complete, promoted, redesign, rejected, scaffold_queued, scaffolding, scaffold_complete, validation_gate, gate_passed, gate_failed, target_sweep, sweep_complete, iterating, published, ready_to_publish, calibrating, needs_review, blocked, archived)
- ToolCallStatus, ToolCall, PlanStep, ChatMessage, ProbeSummary, SweepTrial, SweepSummary interfaces
- Project, DomainState, ProbeVariantResult interfaces

ProjectStore:
- project: {name, targetModel, globalProgress, createdAt}
- setProject, updateProgress, setTargetModel actions
- Persist to localStorage

DomainStore:
- domainStates: Record<DomainId, DomainState>
- setDomainStatus, addArtifact, setProbeSummary, setSweepSummary
- Initialize all 8 domains as 'untested'

UIStore:
- activeTab, focusedDomainId, detailPanelOpen, setupWizardOpen
- globalState (8 states: empty→onboarding→canvas_idle→probing→scaffolding→validating→calibrating→published)
- setActiveTab, setFocusedDomain, openDetailPanel, closeDetailPanel, setSetupWizardOpen, setGlobalState

AgentStore:
- messages: ChatMessage[], isStreaming, currentToolCalls
- addMessage, updateMessage, setStreaming, addToolCall, updateToolCall

**Details:**

Create all 4 Zustand stores with full type definitions.

Files:
- src/lib/types.ts: All TypeScript interfaces
- src/lib/stores/project-store.ts
- src/lib/stores/domain-store.ts
- src/lib/stores/ui-store.ts
- src/lib/stores/agent-store.ts

Types (src/lib/types.ts):
- DomainId: union of 8 domain string literals
- DomainStatus: 22-state union (untested, probe_queued, probing, probe_complete, promoted, redesign, rejected, scaffold_queued, scaffolding, scaffold_complete, validation_gate, gate_passed, gate_failed, target_sweep, sweep_complete, iterating, published, ready_to_publish, calibrating, needs_review, blocked, archived)
- ToolCallStatus, ToolCall, PlanStep, ChatMessage, ProbeSummary, SweepTrial, SweepSummary interfaces
- Project, DomainState, ProbeVariantResult interfaces

ProjectStore:
- project: {name, targetModel, globalProgress, createdAt}
- setProject, updateProgress, setTargetModel actions
- Persist to localStorage

DomainStore:
- domainStates: Record<DomainId, DomainState>
- setDomainStatus, addArtifact, setProbeSummary, setSweepSummary
- Initialize all 8 domains as 'untested'

UIStore:
- activeTab, focusedDomainId, detailPanelOpen, setupWizardOpen
- globalState (8 states: empty→onboarding→canvas_idle→probing→scaffolding→validating→calibrating→published)
- setActiveTab, setFocusedDomain, openDetailPanel, closeDetailPanel, setSetupWizardOpen, setGlobalState

AgentStore:
- messages: ChatMessage[], isStreaming, currentToolCalls
- addMessage, updateMessage, setStreaming, addToolCall, updateToolCall

**Test Strategy:**

Verify TypeScript compiles (npx tsc --noEmit), dev server renders (curl localhost:3000), and visual output matches spec.

## Subtasks

### 3.1. Create src/lib/types.ts with all interfaces and type unions

**Status:** pending  
**Dependencies:** None  

### 3.2. Create project-store.ts with localStorage persistence

**Status:** pending  
**Dependencies:** None  

### 3.3. Create domain-store.ts with 8 domain initialization

**Status:** pending  
**Dependencies:** None  

### 3.4. Create ui-store.ts with global state machine

**Status:** pending  
**Dependencies:** None  

### 3.5. Create agent-store.ts with message and tool call management

**Status:** pending  
**Dependencies:** None  

