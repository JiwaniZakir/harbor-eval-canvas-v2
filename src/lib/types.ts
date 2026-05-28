/* ================================================================
   Harbor Eval Canvas - Type System
   All TypeScript interfaces and type unions.
   ================================================================ */

// --- Domain ---

export type DomainId =
  | 'instruction_following'
  | 'reasoning_logic'
  | 'safety_alignment'
  | 'knowledge_factuality'
  | 'calibration_uncertainty'
  | 'multilinguality'
  | 'long_context'
  | 'tool_use_agency';

export type DomainStatus =
  | 'untested'
  | 'probe_queued'
  | 'probing'
  | 'probe_complete'
  | 'promoted'
  | 'redesign'
  | 'rejected'
  | 'scaffold_queued'
  | 'scaffolding'
  | 'scaffold_complete'
  | 'validation_gate'
  | 'gate_passed'
  | 'gate_failed'
  | 'target_sweep'
  | 'sweep_complete'
  | 'iterating'
  | 'published'
  | 'ready_to_publish'
  | 'calibrating'
  | 'needs_review'
  | 'blocked'
  | 'archived';

export type GlobalState =
  | 'empty'
  | 'onboarding'
  | 'canvas_idle'
  | 'probing'
  | 'scaffolding'
  | 'validating'
  | 'calibrating'
  | 'published';

export type TabId = 'home' | 'agent' | 'project' | 'files' | 'sweeps';

// --- Pipeline ---

export type PipelineStage = 'intake' | 'probe' | 'scaffold' | 'validate' | 'publish';

export type PipelineStageState = 'locked' | 'available' | 'active' | 'complete';

// --- Tool Calls ---

export type ToolCallStatus = 'queued' | 'running' | 'succeeded' | 'failed';

export interface ToolCall {
  id: string;
  name: string;
  args: Record<string, unknown>;
  status: ToolCallStatus;
  result?: string;
  summary?: string;
  startedAt: number;
  finishedAt?: number;
}

// --- Plan ---

export interface PlanStep {
  id: string;
  label: string;
  status: 'pending' | 'active' | 'complete';
}

// --- Chat ---

export type MessageRole = 'user' | 'assistant' | 'system';

export interface ChatMessage {
  id: string;
  role: MessageRole;
  content: string;
  timestamp: number;
  toolCalls?: ToolCall[];
}

// --- Probe ---

export interface ProbeVariant {
  name: string;
  failureRate: number;
  status: 'idle' | 'running' | 'complete' | 'failed';
}

export interface ProbeSummary {
  weaknessTitle: string;
  variants: ProbeVariant[];
  aggregateFailureRate?: number;
  verdict?: 'promote' | 'redesign' | 'reject';
  label?: string;
}

// --- Scaffold ---

export interface ScaffoldAgent {
  name: string;
  artifactLabel: string;
  status: 'idle' | 'running' | 'complete' | 'failed';
}

// --- Validation ---

export interface ValidationGate {
  name: string;
  type: 'oracle' | 'nop' | 'spoiler';
  status: 'pending' | 'running' | 'passed' | 'failed';
}

// --- Sweep ---

export interface SweepTrial {
  idx: number;
  reward: number;
  status: 'pass' | 'fail';
  summary: string;
}

export interface SweepSummary {
  taskSlug: string;
  passAt3: number;
  trials: SweepTrial[];
}

// --- Artifact ---

export interface Artifact {
  id: string;
  name: string;
  type: 'json' | 'jsonl' | 'py' | 'yaml' | 'yml' | 'md' | 'csv' | 'txt';
  size: number;
  domainId: DomainId;
  createdAt: number;
  content?: string;
  parentId?: string;
}

// --- Domain State ---

export interface DomainState {
  id: DomainId;
  status: DomainStatus;
  artifacts: Artifact[];
  probeSummary?: ProbeSummary;
  scaffoldAgents?: ScaffoldAgent[];
  validationGates?: ValidationGate[];
  sweepSummary?: SweepSummary;
  progress: number;
}

// --- Model ---

export type Provider = 'google' | 'anthropic' | 'openai' | 'meta';

export interface TargetModel {
  provider: Provider;
  modelSlug: string;
  modelName: string;
}

// --- Project ---

export interface Project {
  /** Postgres row id. Absent for not-yet-persisted projects. */
  id?: string;
  name: string;
  targetModel: TargetModel;
  workflowDescription?: string;
  globalProgress: number;
  createdAt: number;
}

// --- Activity ---

export interface ActivityItem {
  id: string;
  text: string;
  timestamp: number;
}

// --- Domain Metadata (display info) ---

export const DOMAIN_META: Record<DomainId, { label: string; icon: string; shortLabel: string; graphic: string; description: string }> = {
  instruction_following: { label: 'Instruction Following', icon: 'instruction', shortLabel: 'Instruction', graphic: '/domain-graphics/instruction_following.webp', description: 'Tests whether the model follows complex, multi-part instructions accurately and completely.' },
  reasoning_logic: { label: 'Reasoning & Logic', icon: 'reasoning', shortLabel: 'Reasoning', graphic: '/domain-graphics/reasoning_depth.webp', description: 'Evaluates multi-step logical reasoning, mathematical proofs, and chain-of-thought integrity.' },
  safety_alignment: { label: 'Safety & Alignment', icon: 'safety', shortLabel: 'Safety', graphic: '/domain-graphics/safety_alignment.webp', description: 'Probes refusal behavior, jailbreak resistance, and alignment with human values.' },
  knowledge_factuality: { label: 'Knowledge & Factuality', icon: 'knowledge', shortLabel: 'Knowledge', graphic: '/domain-graphics/factual_accuracy.webp', description: 'Measures factual accuracy, hallucination rate, and knowledge boundary awareness.' },
  calibration_uncertainty: { label: 'Calibration', icon: 'creativity', shortLabel: 'Calibration', graphic: '/domain-graphics/robustness.webp', description: 'Assesses confidence calibration, uncertainty expression, and knowing when to say "I don\'t know".' },
  multilinguality: { label: 'Multilinguality', icon: 'multilingual', shortLabel: 'Multilingual', graphic: '/domain-graphics/multilingual.webp', description: 'Tests cross-lingual transfer, translation quality, and non-English task performance.' },
  long_context: { label: 'Long Context', icon: 'code', shortLabel: 'Long Context', graphic: '/domain-graphics/instruction_following.webp', description: 'Evaluates retrieval accuracy, coherence, and reasoning over long document contexts.' },
  tool_use_agency: { label: 'Tool Use & Agency', icon: 'multimodal', shortLabel: 'Tool Use', graphic: '/domain-graphics/code_generation.webp', description: 'Tests function calling, multi-tool orchestration, and agentic task completion.' },
};

export const ALL_DOMAIN_IDS: DomainId[] = [
  'instruction_following',
  'reasoning_logic',
  'safety_alignment',
  'knowledge_factuality',
  'calibration_uncertainty',
  'multilinguality',
  'long_context',
  'tool_use_agency',
];

// --- Pipeline Stage Meta ---

export const PIPELINE_STAGES: { id: PipelineStage; label: string; icon: string }[] = [
  { id: 'intake', label: 'Intake', icon: 'intake' },
  { id: 'probe', label: 'Probe', icon: 'probe' },
  { id: 'scaffold', label: 'Scaffold', icon: 'scaffold' },
  { id: 'validate', label: 'Validate', icon: 'validate' },
  { id: 'publish', label: 'Publish', icon: 'publish' },
];

// --- Failure Mode Chips ---

export const FAILURE_MODES = [
  'Authority Ambiguity',
  'False Recency',
  'Instruction Drift',
  'Schema Hallucination',
  'Safety Boundary',
  'Context Window',
  'Tool Misuse',
  'Calibration Collapse',
] as const;

// --- Model Options ---

// --- Provider Brand Colors ---

export const PROVIDER_COLORS: Record<Provider, string> = {
  google: '#4285F4',
  anthropic: '#D4A574',
  openai: '#10A37F',
  meta: '#0064E0',
};

// --- File Type Colors ---

export const FILE_TYPE_COLORS: Record<string, string> = {
  json: '#3B82F6',
  jsonl: '#3B82F6',
  py: '#16A34A',
  yaml: '#8B5CF6',
  yml: '#8B5CF6',
  md: 'var(--fg-40)',
  csv: '#D97706',
  txt: 'var(--fg-40)',
};

export const MODEL_OPTIONS: TargetModel[] = [
  { provider: 'google', modelSlug: 'gemini-2.5-pro', modelName: 'Gemini 2.5 Pro' },
  { provider: 'anthropic', modelSlug: 'claude-sonnet-4', modelName: 'Claude Sonnet 4' },
  { provider: 'openai', modelSlug: 'gpt-4.1', modelName: 'GPT-4.1' },
  { provider: 'meta', modelSlug: 'llama-4-maverick', modelName: 'Llama 4 Maverick' },
];
