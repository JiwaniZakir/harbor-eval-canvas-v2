# 03 - API Routes & Backend Pipeline

> Every API endpoint, SSE stream protocol, and backend service.

---

## API Routes

### `POST /api/agent`
Main agent streaming endpoint. Receives user input + workspace context, returns SSE stream of AgentEvents.

```typescript
// Request
interface AgentRequest {
  input: string;
  history: ChatMessage[];
  workspace: {
    phase: AgentPhase;
    artifacts: TaskArtifact[];
    domainId?: DomainId;
    milestoneId?: string;
  };
  projectId?: string;
  trialsPerVariant?: number;
}

// Response: SSE stream of AgentEvent
// Content-Type: text/event-stream
// Each frame: data: {"type":"text","delta":"..."}\n\n
```

### `POST /api/projects`
Create or update a project with full snapshot.

```typescript
// Request
interface ProjectSaveRequest {
  id?: string;           // Omit for create
  name: string;
  snapshot: WorkspaceSnapshot;
}

// Response
interface ProjectSaveResponse {
  id: string;
  updatedAt: number;
}
```

### `GET /api/projects`
List projects, return latest.

```typescript
interface ProjectListResponse {
  projects: Array<{
    id: string;
    name: string;
    targetModel: string;
    globalProgress: number;
    updatedAt: number;
  }>;
  latest: {
    id: string;
    snapshot: WorkspaceSnapshot;
  } | null;
}
```

### `GET /api/projects/[id]/state`
Get full project state.

### `GET /api/env/status`
Check which LLM API keys are configured.

```typescript
interface EnvStatusResponse {
  providers: Array<{
    provider: "google" | "anthropic" | "openai";
    configured: boolean;
    modelSlug: string;
  }>;
  dbConnected: boolean;
}
```

### `POST /api/publish`
Publish a completed task pack to Harbor registry.

---

## SSE Event Protocol

All agent events follow the same shape:

```typescript
type AgentEvent =
  | { type: "phase"; phase: AgentPhase }
  | { type: "plan"; plan: PlanStep[] }
  | { type: "text"; delta: string }
  | { type: "tool_call_start"; call: ToolCall }
  | { type: "tool_call_finish"; id: string; result: unknown; summary?: string }
  | { type: "artifact"; artifact: TaskArtifact }
  | { type: "probe_summary"; summary: ProbeSummary }
  | { type: "weakness_report"; report: WeaknessReport }
  | { type: "decision_report"; entries: DecisionReportEntry[] }
  | { type: "sweep_trial_update"; trial: SweepTrial }
  | { type: "sweep_summary"; summary: SweepSummary }
  | { type: "spoiler_findings"; findings: SpoilerFinding[] }
  | { type: "audit"; audit: AuditSummary }
  | { type: "approval_gate"; gate: ApprovalGate }
  | { type: "milestone_update"; milestoneId: string; status: MilestoneStatus }
  | { type: "domain_update"; domainId: DomainId; state: Partial<DomainState> }
  | { type: "notice"; level: "info" | "warning" | "error"; message: string }
  | { type: "done" }
  | { type: "error"; message: string };
```

---

## Backend Services (lib/)

### Agent Pipeline (`lib/agent/`)
| File | Responsibility |
|------|---------------|
| `types.ts` | All TypeScript types |
| `stages.ts` | Stage definitions and phase-to-stage mapping |
| `system-prompt.ts` | LLM system prompt |
| `llm-runtime.ts` | Vercel AI SDK streaming agent |
| `llm-tools.ts` | Tool definitions (Zod schemas + execute functions) |
| `autopilot.ts` | Autonomous pipeline runner |
| `event-channel.ts` | Event emitter for SSE |
| `seed-workspace.ts` | Empty workspace factory |

### AI Services (`lib/ai/`)
| File | Responsibility |
|------|---------------|
| `providers.ts` | Model registry, provider resolution |
| `workflow-intake.ts` | Structured workflow intake |
| `weakness-map.ts` | Weakness candidate generation |
| `probe-engine.ts` | Single probe execution |
| `probe-runner.ts` | Batch probe orchestration |
| `decision-report.ts` | Probe verdict summarization |
| `scaffold-generator.ts` | Harbor task pack generation |
| `fixture-generator.ts` | Multimodal fixture synthesis |
| `spoiler-lint.ts` | Spoiler detection in artifacts |
| `trajectory-audit.ts` | Failing trajectory classification |
| `structured-output.ts` | Structured output with retry |

### Harbor Integration (`lib/harbor/`)
| File | Responsibility |
|------|---------------|
| `adapter.ts` | Harbor CLI runner |
| `connector.ts` | Harbor registry connector |
| `materialize.ts` | Workspace to filesystem |
| `task-toml.ts` | task.toml generation |
| `validate-task.ts` | Task pack validation |
| `golden-pack.ts` | Golden answer pack builder |

### Database (`lib/db/`)
| File | Responsibility |
|------|---------------|
| `client.ts` | Drizzle ORM client |
| `schema.ts` | Table definitions |
| `seed.ts` | Initial data seeding |
| `sessions.ts` | Session management |

### Domain (`lib/domain/`)
| File | Responsibility |
|------|---------------|
| `taxonomy.ts` | 8 failure mode definitions |
| `domains.ts` | 8 probing domain definitions |
| `milestones.ts` | Preset milestone definitions |
| `roadmap-builder.ts` | Default roadmap construction |
