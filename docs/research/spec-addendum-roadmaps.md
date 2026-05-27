# Addendum: Probing Domain Roadmaps

> **Appends to:** Harbor Eval Canvas Technical Specification
> **Sections affected:** 2 (Conceptual Mapping), 3 (Information Architecture), 5 (Component Inventory), 6 (Interaction Patterns)
> **Based on:** `research/cofounder-roadmap-audit.md` (live audit, 2026-05-24)

---

## A.1 Conceptual Mapping: Roadmaps

### The Cofounder Pattern

In Cofounder.co, each department has a **roadmap** -- an ordered sequence of "tech tree" steps that define the work needed to build that department from scratch. Key properties:

| Property | Cofounder Implementation |
|----------|------------------------|
| Structure | Horizontal strip of 248x72px step cards with dashed connectors |
| Location | Bottom of each department's workspace plate (a large React Flow node) |
| Steps | Globally-keyed tech tree nodes (BANK, WEBSITE, BRAND, etc.) |
| Dependencies | Steps can be locked until prerequisites complete; cross-department refs |
| Status | `available` -> `in_progress` -> `completed` (or `locked` until deps met) |
| Progress | Per-department (N/Total) AND global (11% across all departments) |
| Modes | 3 workspace modes: `roadmap`, `pipeline`, `composer` |
| AI Suggestions | "Suggested Next" section with refreshable, explained recommendations |

### The Harbor Mapping

Each **Probing Domain** gets an **Eval Roadmap** -- a structured sequence of evaluation tasks that comprehensively probe a model's weaknesses in that domain. The roadmap defines the eval coverage plan for that failure-mode category.

| Cofounder Concept | Harbor Equivalent | Notes |
|---|---|---|
| Department Roadmap | **Domain Eval Roadmap** | Ordered sequence of eval milestones per domain |
| Tech Tree Node (BANK, WEBSITE...) | **Eval Milestone** (INSTRUCTION_CONSTRAINT, REASONING_COT...) | Globally-keyed, can appear in multiple domain roadmaps |
| Step status (available/in_progress/locked/completed) | **Milestone status** (available/probing/locked/completed/failed) | Added `failed` for probes that find no weakness |
| Cross-department dependencies | **Cross-domain dependencies** | e.g. Safety roadmap's "jailbreak" milestone unlocks after Instruction Following's "constraint adherence" completes |
| Step icon (tech-tree-icons/*.svg) | **Milestone icon** (eval-icons/*.svg) | Custom icons per eval type |
| Progress bar (N/Total Setup, 11%) | **Coverage meter** (N/Total probed, % coverage) | Per-domain and global |
| Workspace modes (roadmap/pipeline/composer) | **Domain workspace modes** (roadmap/results/composer) | `pipeline` replaced by `results` for sweep/audit data |
| "Suggested Next" | **"Suggested Probes"** | AI recommends which milestones to probe next based on model behavior |
| "Mark complete" (manual) | **"Mark covered"** (manual skip) | User can mark a milestone as already covered externally |
| "Start" (agent-executed) | **"Launch probe"** (agent-executed) | Agent runs the probe pipeline for that milestone |

### Roadmap Sources

Roadmaps can come from three sources:

1. **Preset roadmaps** -- Standard eval coverage plans per domain, shipped with Harbor. These are the default when a user creates a project. Example: the "Reasoning & Logic" domain ships with a preset roadmap of 8 milestones covering chain-of-thought, mathematical reasoning, logical fallacies, etc.

2. **AI-generated roadmaps** -- When a domain agent probes the target model and discovers weaknesses, it generates new milestones dynamically. These are appended to the domain's roadmap and marked as `available`.

3. **User-created milestones** -- Users can add custom milestones to any domain's roadmap via the "New Milestone" action in the workspace.

This three-source model is critical: it means roadmaps are **living documents** that grow as the agent discovers new attack surfaces, not static checklists.

---

## A.2 Information Architecture: Roadmap Types

### New TypeScript Types

```typescript
// ============================================================
// types/roadmap.ts -- Eval Roadmap system types
// ============================================================

import type { DomainSlug } from "./canvas";

// ---- Milestone Keys (global tech-tree equivalents) ----

/**
 * Globally-unique milestone keys, analogous to Cofounder's
 * tech tree node keys (BANK, WEBSITE, BRAND, etc.).
 *
 * A milestone key can appear in multiple domain roadmaps
 * (cross-domain references). The key is the identity;
 * the domain roadmap entry is the instance.
 */
export type MilestoneKey = string; // e.g. "INSTRUCTION_CONSTRAINT", "REASONING_COT"

// ---- Preset Milestone Registry ----

export interface MilestoneDefinition {
  /** Globally-unique key, SCREAMING_SNAKE_CASE */
  key: MilestoneKey;
  /** Human-readable title */
  title: string;
  /** One-line description shown in milestone card subtitle */
  description: string;
  /** Icon filename (without .svg), loaded from /eval-icons/ */
  icon: string;
  /** Primary domain this milestone belongs to */
  primaryDomain: DomainSlug;
  /** Other domains that also reference this milestone (cross-domain deps) */
  crossDomains: DomainSlug[];
  /** Prerequisite milestone keys that must be completed first */
  prerequisites: MilestoneKey[];
  /** Probe strategy hint for the agent */
  probeStrategy: "automated" | "semi-automated" | "manual";
  /** Estimated agent runtime in seconds */
  estimatedDurationSec: number;
  /** Tags for filtering/grouping */
  tags: string[];
}

// ---- Milestone Status ----

export type MilestoneStatus =
  | "locked"       // Prerequisites not met
  | "available"    // Ready to probe (prerequisites met, not started)
  | "probing"      // Agent is actively running probes for this milestone
  | "reviewing"    // Probe results ready for human review
  | "completed"    // Eval tasks generated and accepted
  | "failed"       // Probed but no exploitable weakness found
  | "skipped";     // Manually marked as covered/not-applicable

// ---- Roadmap Instance (per domain) ----

export interface RoadmapMilestone {
  /** Reference to the global milestone definition */
  key: MilestoneKey;
  /** Current status in this domain's roadmap */
  status: MilestoneStatus;
  /** Source: where this milestone came from */
  source: "preset" | "ai-discovered" | "user-created";
  /** Position in the roadmap strip (0-based index) */
  order: number;
  /** Timestamp when probing started */
  probingStartedAt: number | null;
  /** Timestamp when completed/failed/skipped */
  resolvedAt: number | null;
  /** IDs of eval tasks generated from this milestone */
  evalTaskIds: string[];
  /** Agent's reasoning for discovering this milestone (if AI-generated) */
  discoveryRationale: string | null;
  /** Number of weaknesses found during probing */
  weaknessCount: number;
  /** Number of eval tasks generated */
  taskCount: number;
  /** User's note (if manually skipped with reason) */
  skipReason: string | null;
}

export interface DomainRoadmap {
  /** Which domain this roadmap belongs to */
  domainSlug: DomainSlug;
  /** Ordered list of milestones */
  milestones: RoadmapMilestone[];
  /** Progress: completed milestones / total milestones */
  completedCount: number;
  totalCount: number;
  /** Coverage percentage (0-100) */
  coveragePercent: number;
  /** Last time the roadmap was modified */
  updatedAt: number;
}

// ---- Suggested Probes (AI recommendations) ----

export interface SuggestedProbe {
  /** Milestone key to probe */
  milestoneKey: MilestoneKey;
  /** Why this is suggested (shown in tooltip) */
  rationale: string;
  /** Confidence that this probe will find a weakness (0-1) */
  confidence: number;
  /** Action type */
  action: "launch-probe" | "mark-covered";
  /** Priority rank (1 = highest) */
  rank: number;
}

// ---- Roadmap Events (SSE additions) ----

export type RoadmapEvent =
  | { type: "roadmap_init"; domainSlug: DomainSlug; milestones: RoadmapMilestone[] }
  | { type: "milestone_discovered"; domainSlug: DomainSlug; milestone: RoadmapMilestone }
  | { type: "milestone_status_change"; domainSlug: DomainSlug; key: MilestoneKey; status: MilestoneStatus }
  | { type: "milestone_tasks_generated"; domainSlug: DomainSlug; key: MilestoneKey; taskIds: string[] }
  | { type: "suggested_probes"; domainSlug: DomainSlug; suggestions: SuggestedProbe[] }
  | { type: "roadmap_progress"; domainSlug: DomainSlug; completedCount: number; totalCount: number };
```

### Preset Milestone Definitions (Default Roadmaps)

```typescript
// ============================================================
// data/preset-roadmaps.ts -- Default eval roadmaps per domain
// ============================================================

import type { MilestoneDefinition } from "../types/roadmap";

export const PRESET_MILESTONES: MilestoneDefinition[] = [
  // ── Instruction Following ──
  {
    key: "INSTRUCTION_CONSTRAINT",
    title: "Constraint adherence",
    description: "Test compliance with explicit output constraints (format, length, style)",
    icon: "constraint-outline",
    primaryDomain: "instruction",
    crossDomains: [],
    prerequisites: [],
    probeStrategy: "automated",
    estimatedDurationSec: 120,
    tags: ["format", "constraint", "compliance"],
  },
  {
    key: "INSTRUCTION_NEGATION",
    title: "Negation handling",
    description: "Test response to 'do not' and negative instructions",
    icon: "negation-outline",
    primaryDomain: "instruction",
    crossDomains: ["safety"],
    prerequisites: ["INSTRUCTION_CONSTRAINT"],
    probeStrategy: "automated",
    estimatedDurationSec: 90,
    tags: ["negation", "refusal"],
  },
  {
    key: "INSTRUCTION_MULTI_STEP",
    title: "Multi-step instruction following",
    description: "Test execution of compound instructions with ordered steps",
    icon: "steps-outline",
    primaryDomain: "instruction",
    crossDomains: ["reasoning"],
    prerequisites: ["INSTRUCTION_CONSTRAINT"],
    probeStrategy: "automated",
    estimatedDurationSec: 150,
    tags: ["multi-step", "sequence"],
  },
  {
    key: "INSTRUCTION_FORMAT",
    title: "Output format compliance",
    description: "Test adherence to JSON, XML, CSV, markdown table output formats",
    icon: "format-outline",
    primaryDomain: "instruction",
    crossDomains: ["tooluse"],
    prerequisites: [],
    probeStrategy: "automated",
    estimatedDurationSec: 100,
    tags: ["format", "structured-output"],
  },

  // ── Reasoning & Logic ──
  {
    key: "REASONING_COT",
    title: "Chain-of-thought integrity",
    description: "Test for logical consistency in multi-step reasoning chains",
    icon: "chain-outline",
    primaryDomain: "reasoning",
    crossDomains: [],
    prerequisites: [],
    probeStrategy: "automated",
    estimatedDurationSec: 180,
    tags: ["chain-of-thought", "logic"],
  },
  {
    key: "REASONING_MATH",
    title: "Mathematical reasoning",
    description: "Test arithmetic, algebra, and word problem accuracy",
    icon: "math-outline",
    primaryDomain: "reasoning",
    crossDomains: [],
    prerequisites: [],
    probeStrategy: "automated",
    estimatedDurationSec: 120,
    tags: ["math", "arithmetic"],
  },
  {
    key: "REASONING_CAUSAL",
    title: "Causal reasoning",
    description: "Test ability to identify cause-effect relationships and counterfactuals",
    icon: "causal-outline",
    primaryDomain: "reasoning",
    crossDomains: ["knowledge"],
    prerequisites: ["REASONING_COT"],
    probeStrategy: "automated",
    estimatedDurationSec: 150,
    tags: ["causal", "counterfactual"],
  },
  {
    key: "REASONING_FALLACY",
    title: "Logical fallacy detection",
    description: "Test recognition and avoidance of common logical fallacies",
    icon: "fallacy-outline",
    primaryDomain: "reasoning",
    crossDomains: [],
    prerequisites: ["REASONING_COT"],
    probeStrategy: "automated",
    estimatedDurationSec: 120,
    tags: ["fallacy", "logic"],
  },

  // ── Safety & Alignment ──
  {
    key: "SAFETY_REFUSAL",
    title: "Refusal calibration",
    description: "Test appropriate refusal of harmful requests without over-refusing benign ones",
    icon: "shield-outline",
    primaryDomain: "safety",
    crossDomains: ["instruction"],
    prerequisites: [],
    probeStrategy: "semi-automated",
    estimatedDurationSec: 200,
    tags: ["refusal", "safety"],
  },
  {
    key: "SAFETY_JAILBREAK",
    title: "Jailbreak resistance",
    description: "Test resistance to prompt injection and jailbreak attempts",
    icon: "lock-outline",
    primaryDomain: "safety",
    crossDomains: ["instruction"],
    prerequisites: ["SAFETY_REFUSAL", "INSTRUCTION_NEGATION"],
    probeStrategy: "automated",
    estimatedDurationSec: 300,
    tags: ["jailbreak", "injection", "adversarial"],
  },
  {
    key: "SAFETY_BIAS",
    title: "Bias detection",
    description: "Test for demographic, cultural, and ideological biases in outputs",
    icon: "balance-outline",
    primaryDomain: "safety",
    crossDomains: ["calibration"],
    prerequisites: [],
    probeStrategy: "semi-automated",
    estimatedDurationSec: 240,
    tags: ["bias", "fairness"],
  },

  // ── Knowledge & Factuality ──
  {
    key: "KNOWLEDGE_HALLUCINATION",
    title: "Hallucination detection",
    description: "Test for fabricated facts, citations, and entities",
    icon: "hallucination-outline",
    primaryDomain: "knowledge",
    crossDomains: ["calibration"],
    prerequisites: [],
    probeStrategy: "automated",
    estimatedDurationSec: 180,
    tags: ["hallucination", "factuality"],
  },
  {
    key: "KNOWLEDGE_TEMPORAL",
    title: "Temporal knowledge boundaries",
    description: "Test awareness of knowledge cutoff and handling of post-training events",
    icon: "calendar-outline",
    primaryDomain: "knowledge",
    crossDomains: ["calibration"],
    prerequisites: [],
    probeStrategy: "automated",
    estimatedDurationSec: 120,
    tags: ["temporal", "cutoff"],
  },
  {
    key: "KNOWLEDGE_DOMAIN",
    title: "Domain-specific accuracy",
    description: "Test accuracy in specialized domains (law, medicine, finance, science)",
    icon: "domain-knowledge-outline",
    primaryDomain: "knowledge",
    crossDomains: [],
    prerequisites: ["KNOWLEDGE_HALLUCINATION"],
    probeStrategy: "semi-automated",
    estimatedDurationSec: 300,
    tags: ["domain", "expert"],
  },

  // ── Calibration & Uncertainty ──
  {
    key: "CALIBRATION_CONFIDENCE",
    title: "Confidence calibration",
    description: "Test whether stated confidence matches actual accuracy",
    icon: "confidence-outline",
    primaryDomain: "calibration",
    crossDomains: ["knowledge"],
    prerequisites: [],
    probeStrategy: "automated",
    estimatedDurationSec: 150,
    tags: ["confidence", "calibration"],
  },
  {
    key: "CALIBRATION_UNCERTAINTY",
    title: "Uncertainty expression",
    description: "Test ability to express 'I don't know' when appropriate",
    icon: "uncertainty-outline",
    primaryDomain: "calibration",
    crossDomains: ["safety"],
    prerequisites: ["CALIBRATION_CONFIDENCE"],
    probeStrategy: "automated",
    estimatedDurationSec: 120,
    tags: ["uncertainty", "epistemic"],
  },

  // ── Multilinguality ──
  {
    key: "MULTILINGUAL_TRANSFER",
    title: "Cross-lingual transfer",
    description: "Test instruction following and reasoning consistency across languages",
    icon: "language-outline",
    primaryDomain: "multilingual",
    crossDomains: ["instruction", "reasoning"],
    prerequisites: ["INSTRUCTION_CONSTRAINT"],
    probeStrategy: "automated",
    estimatedDurationSec: 200,
    tags: ["multilingual", "transfer"],
  },
  {
    key: "MULTILINGUAL_CULTURAL",
    title: "Cultural sensitivity",
    description: "Test awareness of cultural context in multilingual responses",
    icon: "culture-outline",
    primaryDomain: "multilingual",
    crossDomains: ["safety"],
    prerequisites: [],
    probeStrategy: "semi-automated",
    estimatedDurationSec: 180,
    tags: ["cultural", "sensitivity"],
  },

  // ── Long Context ──
  {
    key: "LONGCTX_RETRIEVAL",
    title: "Needle-in-haystack retrieval",
    description: "Test accurate retrieval of facts from various positions in long documents",
    icon: "search-document-outline",
    primaryDomain: "longctx",
    crossDomains: ["knowledge"],
    prerequisites: [],
    probeStrategy: "automated",
    estimatedDurationSec: 300,
    tags: ["retrieval", "long-context"],
  },
  {
    key: "LONGCTX_BOUNDARY",
    title: "Context window boundary effects",
    description: "Test behavior near context window limits and graceful degradation",
    icon: "boundary-outline",
    primaryDomain: "longctx",
    crossDomains: [],
    prerequisites: ["LONGCTX_RETRIEVAL"],
    probeStrategy: "automated",
    estimatedDurationSec: 240,
    tags: ["boundary", "truncation"],
  },

  // ── Tool Use & Agency ──
  {
    key: "TOOLUSE_SELECTION",
    title: "Tool selection accuracy",
    description: "Test correct tool choice given a task description and available tools",
    icon: "tool-outline",
    primaryDomain: "tooluse",
    crossDomains: ["reasoning"],
    prerequisites: [],
    probeStrategy: "automated",
    estimatedDurationSec: 150,
    tags: ["tool-use", "selection"],
  },
  {
    key: "TOOLUSE_CALLING",
    title: "Function calling correctness",
    description: "Test parameter formatting, type adherence, and error handling in function calls",
    icon: "function-outline",
    primaryDomain: "tooluse",
    crossDomains: ["instruction"],
    prerequisites: ["TOOLUSE_SELECTION"],
    probeStrategy: "automated",
    estimatedDurationSec: 180,
    tags: ["function-calling", "api"],
  },
  {
    key: "TOOLUSE_MULTI_STEP",
    title: "Multi-step tool orchestration",
    description: "Test planning and executing multi-tool workflows with data passing",
    icon: "orchestration-outline",
    primaryDomain: "tooluse",
    crossDomains: ["reasoning"],
    prerequisites: ["TOOLUSE_CALLING", "REASONING_COT"],
    probeStrategy: "automated",
    estimatedDurationSec: 300,
    tags: ["orchestration", "planning"],
  },
];

/**
 * Build the default roadmap for a domain from preset milestones.
 */
export function buildDefaultRoadmap(domainSlug: DomainSlug): DomainRoadmap {
  const domainMilestones = PRESET_MILESTONES
    .filter((m) => m.primaryDomain === domainSlug)
    .map((m, i): RoadmapMilestone => ({
      key: m.key,
      status: m.prerequisites.length === 0 ? "available" : "locked",
      source: "preset",
      order: i,
      probingStartedAt: null,
      resolvedAt: null,
      evalTaskIds: [],
      discoveryRationale: null,
      weaknessCount: 0,
      taskCount: 0,
      skipReason: null,
    }));

  return {
    domainSlug,
    milestones: domainMilestones,
    completedCount: 0,
    totalCount: domainMilestones.length,
    coveragePercent: 0,
    updatedAt: Date.now(),
  };
}
```

### Zustand Store Additions

```typescript
// Additions to CanvasState interface
interface CanvasState {
  // ... existing fields ...

  /** Roadmaps per domain */
  roadmaps: Record<DomainSlug, DomainRoadmap>;
  /** Global milestone registry (preset + discovered) */
  milestoneRegistry: Record<MilestoneKey, MilestoneDefinition>;
  /** AI-suggested next probes per domain */
  suggestedProbes: Record<DomainSlug, SuggestedProbe[]>;
  /** Global coverage across all domains */
  globalCoveragePercent: number;
}

// New actions
interface CanvasActions {
  // ... existing actions ...

  /** Initialize roadmaps from presets when project starts */
  initRoadmaps(): void;
  /** Add a new AI-discovered milestone to a domain's roadmap */
  addDiscoveredMilestone(domainSlug: DomainSlug, milestone: RoadmapMilestone, definition: MilestoneDefinition): void;
  /** Add a user-created milestone */
  addCustomMilestone(domainSlug: DomainSlug, title: string, description: string): void;
  /** Update milestone status (triggers dependency resolution) */
  updateMilestoneStatus(domainSlug: DomainSlug, key: MilestoneKey, status: MilestoneStatus): void;
  /** Skip a milestone with reason */
  skipMilestone(domainSlug: DomainSlug, key: MilestoneKey, reason: string): void;
  /** Refresh AI suggestions for a domain */
  refreshSuggestions(domainSlug: DomainSlug): void;
  /** Reorder milestones in a roadmap */
  reorderMilestones(domainSlug: DomainSlug, fromIndex: number, toIndex: number): void;
  /** Recalculate coverage after status changes */
  recalcRoadmapCoverage(domainSlug: DomainSlug): void;
}
```

### Dependency Resolution

```typescript
/**
 * When a milestone completes, unlock any milestones in ANY domain
 * that had it as a prerequisite. This implements Cofounder's
 * cross-department dependency graph.
 */
function resolveDependencies(
  state: CanvasState,
  completedKey: MilestoneKey,
): Map<DomainSlug, MilestoneKey[]> {
  const unlocked = new Map<DomainSlug, MilestoneKey[]>();

  for (const [domainSlug, roadmap] of Object.entries(state.roadmaps)) {
    for (const milestone of roadmap.milestones) {
      if (milestone.status !== "locked") continue;

      const def = state.milestoneRegistry[milestone.key];
      if (!def) continue;

      // Check if all prerequisites are now met
      const allPrereqsMet = def.prerequisites.every((prereqKey) => {
        // Search across ALL domains for this prereq being completed
        return Object.values(state.roadmaps).some((rm) =>
          rm.milestones.some(
            (m) => m.key === prereqKey && (m.status === "completed" || m.status === "skipped"),
          ),
        );
      });

      if (allPrereqsMet) {
        milestone.status = "available";
        const existing = unlocked.get(domainSlug as DomainSlug) ?? [];
        existing.push(milestone.key);
        unlocked.set(domainSlug as DomainSlug, existing);
      }
    }
  }

  return unlocked;
}
```

---

## A.3 Component Inventory: Roadmap Components

### `RoadmapStrip`
- **File:** `components/canvas/RoadmapStrip.tsx`
- **Props:**
  ```typescript
  interface RoadmapStripProps {
    domainSlug: DomainSlug;
    roadmap: DomainRoadmap;
    accentColor: string;
    onMilestoneClick: (key: MilestoneKey) => void;
    onLaunchProbe: (key: MilestoneKey) => void;
    onMarkCovered: (key: MilestoneKey) => void;
  }
  ```
- **Visual Details:**
  - Horizontal scrollable container at bottom of DomainWorkspace/workspace plate
  - Header: "{Domain} Roadmap" (font-mono text-xs text-fg-70) + progress "N/Total" + mini progress bars (h-[3px] w-3 segments)
  - Step cards scroll left-to-right with dashed connectors between them
  - Overflow: `overflow-x-auto overflow-y-hidden`, custom scrollbar hidden
  - Padding: p-3 around the card strip
- **Cofounder Mapping:** Department roadmap strip embedded in workspace plate node
- **Priority:** P0

### `MilestoneCard`
- **File:** `components/canvas/MilestoneCard.tsx`
- **Props:**
  ```typescript
  interface MilestoneCardProps {
    milestone: RoadmapMilestone;
    definition: MilestoneDefinition;
    accentColor: string;
    onClick: () => void;
  }
  ```
- **Visual Details:**
  - Size: 248x72px, rounded-[12px]
  - Background: `bg-background-screen`
  - Left icon: 48x48px square, rounded-[6px], icon via CSS mask-image
  - Title: 13px, font-medium, text-foreground-80
  - Subtitle: 11px, text-foreground-50 (status text)
  - Status badge: 16x16px top-right (lock for locked, checkmark for completed)
  - Active card (in_progress): accent ring (2px), accent-soft shadow, shimmer overlay
  - Locked card: opacity 0.72, lock badge
  - Hover (when available): -translate-y-1px, border-foreground-20
  - Box-shadow: `var(--shadow-outset-025)`, plus accent ring for active
- **Cofounder Mapping:** Exact replica of `department-roadmap-step-card`
- **Priority:** P0

### `MilestoneConnector`
- **File:** `components/canvas/MilestoneConnector.tsx`
- **Props:**
  ```typescript
  interface MilestoneConnectorProps {
    fromStatus: MilestoneStatus;
    toStatus: MilestoneStatus;
  }
  ```
- **Visual Details:**
  - Size: w-[43px] h-1
  - Dashed line: `border-dashed border-foreground-30`
  - Center icon: 16x16px, rounded-[4px], bg-background-l100
    - Lock icon when `toStatus === "locked"`
    - Checkmark when `fromStatus === "completed"`
    - Arrow-right when both are available
  - Shadow: multi-layer inset matching Cofounder's connector badge
- **Priority:** P0

### `SuggestedProbesPanel`
- **File:** `components/detail/SuggestedProbesPanel.tsx`
- **Props:**
  ```typescript
  interface SuggestedProbesPanelProps {
    suggestions: SuggestedProbe[];
    milestoneRegistry: Record<MilestoneKey, MilestoneDefinition>;
    onLaunchProbe: (key: MilestoneKey) => void;
    onMarkCovered: (key: MilestoneKey) => void;
    onRefresh: () => void;
  }
  ```
- **Visual Details:**
  - Section header: "SUGGESTED NEXT" (11px, font-semibold, uppercase, tracking-[1px], text-foreground-40) + refresh button (icon, 14px)
  - Each suggestion: 32px-tall row with:
    - Circle indicator: 10x10px SVG, dashed stroke (stroke-dasharray: 2.4 2.8)
    - Title: 13px, text-foreground-90
    - Hover reveals action buttons ("Launch probe" or "Mark covered")
  - Tooltip on hover: shows rationale text
- **Cofounder Mapping:** Exact replica of "Suggested Next" section
- **Priority:** P1

### `RoadmapProgressBar`
- **File:** `components/shared/RoadmapProgressBar.tsx`
- **Props:**
  ```typescript
  interface RoadmapProgressBarProps {
    completed: number;
    total: number;
    accentColor: string;
    showLabel?: boolean;
  }
  ```
- **Visual Details:**
  - Row of `total` segments, each h-[3px] w-3
  - Completed segments: bg-{accentColor} (or bg-foreground-80)
  - In-progress segments: bg-{accentColor} with pulse animation
  - Incomplete segments: bg-foreground-10
  - Label (optional): "N/Total" text-foreground-80, text-xs
  - Gap between segments: gap-1
- **Priority:** P0

---

## A.4 Interaction Patterns: Roadmap Flows

### Flow 1: Project Initialization with Roadmaps

```
After hub + domain nodes appear (from existing Section 6.1):

Step 6: Roadmaps Initialize
├─ Each domain gets its default roadmap from PRESET_MILESTONES
├─ Roadmap milestones resolve initial dependencies:
│   ├─ Root milestones (no prerequisites) → status: "available"
│   └─ Dependent milestones → status: "locked"
├─ DomainNode now shows a mini progress indicator (0/N)
├─ Workspace plates show roadmap strips at bottom
└─ Chat: "Roadmaps initialized. Each domain has a coverage plan with {N} total milestones."

Step 7: Agent Analysis Extends Roadmaps
├─ Background agent analyzes the target model
├─ Discovers domain-specific weaknesses the preset roadmap doesn't cover
├─ Fires `milestone_discovered` events:
│   ├─ New milestone card animates into the roadmap strip (slide-in from right, 300ms)
│   ├─ Source badge: "AI-discovered" pill on the card
│   └─ DomainNode progress updates: "0/{N+new}" 
├─ Chat: "Discovered new weakness area in {domain}: '{milestone title}'. Added to roadmap."
└─ Roadmap progress denominator increases (more ground to cover)
```

### Flow 2: Probing a Milestone

```
User clicks an "available" MilestoneCard in the roadmap strip:

Frame 0ms:
├─ MilestoneCard: border transitions to accent color, shimmer begins
├─ Status: available → probing
├─ Timer starts on the card
├─ Chat context switches to domain (if not already focused)
├─ Chat: "Starting probe: {milestone title}..."
└─ Domain agent begins probe pipeline for this specific milestone

Frame 0-N (probing):
├─ Agent sends diagnostic prompts targeting this milestone's weakness area
├─ Probe results stream into ProbeResultsPanel
├─ MilestoneCard shimmer continues
├─ If weaknesses found: weaknessCount increments on the milestone
└─ Adjacent locked milestones remain locked

Frame N (probe complete):
├─ If weaknesses found (weaknessCount > 0):
│   ├─ Status: probing → reviewing
│   ├─ Agent generates eval tasks from discovered weaknesses
│   ├─ Tasks appear in domain workspace Tasks tab
│   ├─ MilestoneCard: shimmer stops, shows "N weaknesses found"
│   └─ ApprovalGate may fire if configured
├─ If no weaknesses found:
│   ├─ Status: probing → failed
│   ├─ MilestoneCard: dims, shows "No exploitable weakness"
│   ├─ Card gets a subtle red-tint, but NOT removed from roadmap
│   └─ Chat: "Probe complete for '{title}'. Model appears robust in this area."
└─ Dependency resolution runs:
    ├─ Check if any locked milestones had this as a prerequisite
    ├─ If all prereqs met: locked → available (unlock animation on card)
    └─ Unlock animation: lock icon fades, card opacity 0.72 → 1.0, border brightens
```

### Flow 3: AI-Discovered Milestones

```
During probing or between probes, the domain agent discovers a new attack surface:

├─ Agent fires `milestone_discovered` event
├─ New MilestoneDefinition registered in milestoneRegistry
├─ New RoadmapMilestone appended to domain roadmap:
│   ├─ source: "ai-discovered"
│   ├─ status: "available" (or "locked" if it depends on another milestone)
│   └─ discoveryRationale: agent's reasoning
├─ RoadmapStrip: new card slides in from right (300ms, ease-out)
│   ├─ Card has a distinctive "AI" pill badge (accent-colored, 8px font, top-left)
│   ├─ Brief glow animation on entry (accent-glow pulse, 600ms)
│   └─ Scroll position auto-adjusts to show new card
├─ DomainNode: progress counter updates (denominator increases)
├─ Chat: "Discovered new eval target: '{title}' — {rationale}"
└─ SuggestedProbesPanel: refreshes to include the new milestone
```

### Flow 4: Cross-Domain Dependencies

```
User completes "INSTRUCTION_CONSTRAINT" in Instruction Following domain:

├─ Instruction Following roadmap: milestone → completed
├─ Dependency resolution runs across ALL domains:
│   ├─ Safety: "SAFETY_JAILBREAK" has prereq ["SAFETY_REFUSAL", "INSTRUCTION_NEGATION"]
│   │   └─ INSTRUCTION_NEGATION depends on INSTRUCTION_CONSTRAINT (now completed)
│   │   └─ If SAFETY_REFUSAL also completed → SAFETY_JAILBREAK unlocks
│   ├─ Reasoning: "REASONING_COT" has no prereqs → already available
│   ├─ Multilingual: "MULTILINGUAL_TRANSFER" has prereq ["INSTRUCTION_CONSTRAINT"]
│   │   └─ Now completed → MULTILINGUAL_TRANSFER unlocks! 🎉
│   └─ Tool Use: "TOOLUSE_CALLING" has prereq ["TOOLUSE_SELECTION"]
│       └─ No change (different prereq)
├─ Visual feedback on the Multilingual domain node:
│   ├─ Brief accent pulse on the domain node (300ms)
│   ├─ Roadmap strip: unlocked card animates (lock fades, opacity increases)
│   └─ Chat (global context): "Cross-domain unlock: 'Cross-lingual transfer' is now available in Multilinguality"
└─ Global coverage denominator unchanged (milestones existed, just locked)
```

### Flow 5: Manual "Mark Covered" Flow

```
User wants to skip a milestone (already covered by external eval):

├─ User clicks milestone → MilestoneCard detail opens in Detail Panel
├─ "Mark as covered" button in detail footer
├─ Click → Confirmation dialog:
│   ├─ "Skip '{title}'? This marks the milestone as externally covered."
│   ├─ Optional: "Reason" text input
│   ├─ "Skip & Continue" button / "Cancel" button
│   └─ Keyboard: Cmd+Enter = confirm
├─ On confirm:
│   ├─ Status: available → skipped
│   ├─ MilestoneCard: grey-tinted, strikethrough on title, skip reason shown
│   ├─ Dependencies resolve (skipped counts as "met")
│   ├─ Progress: completedCount increments (skipped counts toward coverage)
│   └─ Chat: "Milestone '{title}' marked as covered. Reason: {reason}"
└─ Roadmap strip: card slides to end of completed section, progress bar updates
```

### Flow 6: "Suggested Probes" Refresh

```
User clicks refresh (↻) on SuggestedProbesPanel:

├─ Loading state: existing suggestions fade to 50% opacity
├─ Agent analyzes:
│   ├─ Current roadmap state (what's available, what's completed)
│   ├─ Target model's observed behavior from previous probes
│   ├─ Cross-domain dependency graph (what unlocks the most?)
│   └─ Estimated impact (which probes most likely to find weaknesses?)
├─ New suggestions arrive (SSE event):
│   ├─ Old suggestions cross-fade to new (150ms)
│   ├─ Each suggestion has confidence score and rationale
│   └─ Sorted by rank (highest impact first)
├─ Tooltip on each suggestion: "Completing this milestone unlocks {N} milestones across {M} domains"
└─ Action buttons: "Launch probe" (for automated) or "Mark covered" (for manual)
```

---

## A.5 Workspace Modes

Matching Cofounder's three workspace modes per department, each domain has three workspace modes:

| Mode | Cofounder Equivalent | Content | When Active |
|------|---------------------|---------|-------------|
| `roadmap` | `roadmap` | RoadmapStrip + MilestoneCards + SuggestedProbes | Default for most domains |
| `results` | `pipeline` | ProbeResultsPanel + SweepDashboard + AuditView | After probes complete |
| `composer` | `composer` | ChatComposer integrated into workspace + artifact editing | For manual task creation |

Mode switching via TabNav in workspace header. Active mode persisted per domain.

---

## A.6 Global Coverage Dashboard

The hub node shows global coverage:
```
Hub Node:
  ┌─────────────┐
  │  ⬡ Harbor   │
  │  GPT-4o     │
  │  ██████░░   │ ← Global coverage bar
  │    34%      │
  └─────────────┘
```

Global coverage = (completed + skipped milestones across all domains) / (total milestones across all domains) * 100

This maps directly to Cofounder's "11% complete" global roadmap progress.
