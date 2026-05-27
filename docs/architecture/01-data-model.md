# 01 - Data Model & State Architecture

> Source of truth for every entity in Harbor Eval Canvas.

---

## 1. Core Entities

### Project

Top-level container. One project = one target model evaluation campaign.

```typescript
interface Project {
  id: string;                    // UUID
  name: string;                  // "Gemini 3 Flash Eval Campaign"
  slug: string;                  // "gemini-3-flash-eval"
  targetModel: TargetModelConfig;
  auditorModel: string;          // Model slug for the auditor (must differ from target)
  runner: string;                // "gemini-cli" | "claude-cli" | "openai-responses"
  runConfigHash: string;         // Pinned run config hash for reproducibility
  status: ProjectStatus;
  globalProgress: number;        // 0-100, computed from domain roadmaps
  createdAt: number;
  updatedAt: number;
}

type ProjectStatus = "setup" | "active" | "paused" | "completed" | "archived";

interface TargetModelConfig {
  provider: "google" | "anthropic" | "openai";
  modelSlug: string;             // "gemini-2.0-flash"
  displayName: string;           // "Gemini 3 Flash Preview"
  runner: string;
}
```

### ProbingDomain

The 8 vulnerability categories. These are static definitions with dynamic state.

```typescript
type DomainId =
  | "instruction_following"
  | "reasoning_logic"
  | "safety_alignment"
  | "knowledge_factuality"
  | "calibration_uncertainty"
  | "multilinguality"
  | "long_context"
  | "tool_use_agency";

interface ProbingDomain {
  id: DomainId;
  label: string;                 // "Instruction Following"
  shortLabel: string;            // "Instructions"
  description: string;           // What this domain probes
  accent: string;                // "#4087F2"
  icon: string;                  // Lucide icon name: "list-checks"
  order: number;                 // 0-7, position on canvas ring
}

interface DomainState {
  domainId: DomainId;
  status: DomainStatus;
  progress: number;              // 0-100
  milestonesTotal: number;
  milestonesCompleted: number;
  activeMilestoneId: string | null;
  agentId: string | null;        // Currently assigned agent
}

type DomainStatus =
  | "locked"        // Prerequisites not met
  | "available"     // Ready to start probing
  | "probing"       // Agent actively working
  | "paused"        // User paused
  | "reviewing"     // Awaiting user review
  | "completed";    // All milestones done
```

### Milestone

A single eval objective within a domain roadmap.

```typescript
type MilestoneSource = "preset" | "ai_discovered" | "user_created";

type MilestoneStatus =
  | "locked"        // Dependency not met
  | "available"     // Ready to start
  | "in_progress"   // Being worked on
  | "probing"       // Probe phase
  | "building"      // Scaffold/fixture phase
  | "validating"    // Sweep/audit phase
  | "completed"     // pass@3 < 30% confirmed
  | "failed"        // Could not achieve target
  | "skipped";      // User marked skip

interface Milestone {
  id: string;                    // "INSTRUCTION_CONSTRAINT"
  domainId: DomainId;
  label: string;                 // "Constraint Following"
  description: string;
  source: MilestoneSource;
  status: MilestoneStatus;
  order: number;                 // Position in roadmap strip
  prerequisites: string[];       // Other milestone IDs
  crossDomainRefs: string[];     // Milestones in other domains this unlocks
  probeStrategy: string;         // How to probe this
  evalTaskId: string | null;     // Linked eval task once built
  discoveredBy: string | null;   // Agent that discovered (for ai_discovered)
  createdAt: number;
  updatedAt: number;
}
```

### EvalTask

A Harbor task pack being designed.

```typescript
type TaskPhase =
  | "intake"
  | "weakness_mapping"
  | "probing"
  | "decision"
  | "scaffolding"
  | "fixtures"
  | "verifier"
  | "sweep"
  | "audit"
  | "iteration"
  | "published";

interface EvalTask {
  id: string;
  projectId: string;
  domainId: DomainId;
  milestoneId: string;
  slug: string;                  // "invoice-reconciliation"
  title: string;
  phase: TaskPhase;
  weaknessCard: WeaknessCard | null;
  probeSummary: ProbeSummary | null;
  sweepSummary: SweepSummary | null;
  artifacts: Record<string, TaskArtifact>;
  passAt3: number | null;        // Final pass@3 score
  createdAt: number;
  updatedAt: number;
}

interface WeaknessCard {
  weaknessTitle: string;
  domain: string;
  deliverable: string;
  hypothesis: string;
  badHeuristic: string;
  authorityInvariant: string;
  taxonomySlug: FailureModeSlug;
  workflowFitScore: number;
  verifierStrategy: string;
}

type FailureModeSlug =
  | "authority_ambiguity"
  | "false_recency"
  | "wrong_source"
  | "phantom_join"
  | "tie_breaking"
  | "null_cascade"
  | "provenance"
  | "lifecycle";
```

### TaskArtifact

Files generated during task building.

```typescript
type ArtifactKind =
  | "markdown" | "toml" | "python" | "json"
  | "shell" | "csv" | "yaml" | "diff";

interface TaskArtifact {
  path: string;                  // "instruction.md"
  kind: ArtifactKind;
  content: string;
  badge?: string;                // "instruction" | "fixture" | "verifier"
  updatedAt: number;
  dirty?: boolean;
  taskSlug?: string;
}
```

### ProbeSession

```typescript
interface ProbeSession {
  id: string;
  evalTaskId: string;
  weaknessTitle: string;
  variants: ProbeVariant[];
  verdict: "promote" | "redesign" | "reject";
  aggregateFailureRate: number;
  createdAt: number;
}

interface ProbeVariant {
  variant: "plain" | "prior_work" | "schema" | "audit" | "speed";
  failureRate: number;
  trials: number;
  failures: number;
}
```

### AgentRun

```typescript
type AgentLifecycle =
  | "idle"
  | "initializing"
  | "probing"
  | "analyzing"
  | "building"
  | "validating"
  | "awaiting_approval"
  | "complete"
  | "error";

interface AgentRun {
  id: string;
  projectId: string;
  domainId: DomainId;
  milestoneId: string;
  lifecycle: AgentLifecycle;
  messages: ChatMessage[];
  currentPlan: PlanStep[];
  toolCalls: ToolCall[];
  startedAt: number;
  finishedAt?: number;
  error?: string;
}
```

---

## 2. Canvas Node & Edge Types

For @xyflow/react canvas rendering.

```typescript
// --- Node Types ---

type CanvasNodeType =
  | "centerModel"
  | "domain"
  | "milestone"
  | "agentActivity";

interface CenterModelNodeData {
  type: "centerModel";
  modelName: string;
  provider: string;
  globalProgress: number;
  status: ProjectStatus;
}

interface DomainNodeData {
  type: "domain";
  domain: ProbingDomain;
  state: DomainState;
  milestoneCount: number;
  expanded: boolean;
}

interface MilestoneNodeData {
  type: "milestone";
  milestone: Milestone;
  domainAccent: string;
}

interface AgentActivityNodeData {
  type: "agentActivity";
  agentRun: AgentRun;
  domainAccent: string;
  currentAction: string;
}

// --- Edge Types ---

type CanvasEdgeType =
  | "domainConnection"    // Center -> Domain
  | "dependencyEdge"      // Milestone -> Milestone (cross-domain)
  | "progressEdge";       // Domain -> Milestone strip

interface DomainConnectionData {
  domainId: DomainId;
  accent: string;
  progress: number;
  animated: boolean;
}
```

---

## 3. Zustand Store Architecture

Five stores, cleanly separated by concern.

```
CanvasStore  -- nodes, edges, viewport, layout
ProjectStore -- project metadata, model config
DomainStore  -- domain states, roadmaps, milestones
AgentStore   -- agent runs, messages, streaming
UIStore      -- panels, focus, modals, notifications
```

### CanvasStore
```typescript
interface CanvasStore {
  nodes: Node[];
  edges: Edge[];
  viewport: Viewport;
  selectedNodeId: string | null;
  hoveredNodeId: string | null;
  layoutMode: "radial" | "grid" | "freeform";
  miniMapVisible: boolean;

  // Actions
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  setViewport: (viewport: Viewport) => void;
  selectNode: (id: string | null) => void;
  setLayoutMode: (mode: CanvasStore["layoutMode"]) => void;
  fitView: () => void;
  expandDomain: (domainId: DomainId) => void;
  collapseDomain: (domainId: DomainId) => void;
}
```

### ProjectStore
```typescript
interface ProjectStore {
  project: Project | null;
  loading: boolean;
  error: string | null;

  initProject: (name: string, targetModel: TargetModelConfig) => void;
  updateProject: (partial: Partial<Project>) => void;
  setTargetModel: (config: TargetModelConfig) => void;
  loadProject: (id: string) => Promise<void>;
  saveProject: () => Promise<void>;
}
```

### DomainStore
```typescript
interface DomainStore {
  domains: Record<DomainId, DomainState>;
  milestones: Record<string, Milestone>;
  suggestedProbes: SuggestedProbe[];

  setDomainStatus: (id: DomainId, status: DomainStatus) => void;
  updateMilestone: (id: string, partial: Partial<Milestone>) => void;
  addMilestone: (milestone: Milestone) => void;
  removeMilestone: (id: string) => void;
  resolveDependencies: () => void;
  refreshSuggestedProbes: () => void;
  getDomainsProgress: () => number;
}

interface SuggestedProbe {
  milestoneId: string;
  domainId: DomainId;
  rationale: string;
  priority: "high" | "medium" | "low";
}
```

### AgentStore
```typescript
interface AgentStore {
  activeRuns: Record<string, AgentRun>;
  streamingRunId: string | null;
  messages: ChatMessage[];
  pendingApproval: ApprovalGate | null;

  startRun: (domainId: DomainId, milestoneId: string) => Promise<void>;
  stopRun: (runId: string) => void;
  sendMessage: (input: string) => Promise<void>;
  respondToApproval: (decision: "approve" | "reject") => Promise<void>;
  applyEvent: (event: AgentEvent) => void;
}
```

### UIStore
```typescript
interface UIStore {
  // Panel states
  detailPanelOpen: boolean;
  detailPanelContent: DetailPanelContent | null;
  companionOpen: boolean;
  commandPaletteOpen: boolean;

  // Focus
  focusedDomain: DomainId | null;
  focusedMilestone: string | null;
  focusedTask: string | null;

  // Notifications
  notices: Notice[];

  // Theme
  theme: "dark";

  // Actions
  openDetailPanel: (content: DetailPanelContent) => void;
  closeDetailPanel: () => void;
  toggleCompanion: () => void;
  setFocusedDomain: (id: DomainId | null) => void;
  pushNotice: (notice: Omit<Notice, "id" | "createdAt">) => void;
  dismissNotice: (id: string) => void;
}

type DetailPanelContent =
  | { kind: "domain"; domainId: DomainId }
  | { kind: "milestone"; milestoneId: string }
  | { kind: "task"; taskId: string }
  | { kind: "artifact"; path: string }
  | { kind: "probe"; sessionId: string }
  | { kind: "sweep"; taskSlug: string };
```

---

## 4. State Machines

### Project: setup -> active -> paused -> completed -> archived
### Domain: locked -> available -> probing -> paused -> reviewing -> completed
### Milestone: locked -> available -> in_progress -> probing -> building -> validating -> completed | failed | skipped
### Agent: idle -> initializing -> probing -> analyzing -> building -> validating -> awaiting_approval -> complete | error
### Task: intake -> weakness_mapping -> probing -> decision -> scaffolding -> fixtures -> verifier -> sweep -> audit -> iteration -> published
