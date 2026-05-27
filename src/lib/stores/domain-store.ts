import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  DomainId,
  DomainState,
  DomainStatus,
  ProbeSummary,
  SweepSummary,
  Artifact,
  ScaffoldAgent,
  ValidationGate,
} from '../types';

// Re-import as value (not type-only)
import { ALL_DOMAIN_IDS as DOMAIN_IDS } from '../types';

function createInitialDomain(id: DomainId): DomainState {
  return {
    id,
    status: 'untested',
    artifacts: [],
    progress: 0,
  };
}

function createInitialDomains(): Record<DomainId, DomainState> {
  const domains = {} as Record<DomainId, DomainState>;
  for (const id of DOMAIN_IDS) {
    domains[id] = createInitialDomain(id);
  }
  return domains;
}

interface DomainStoreState {
  domainStates: Record<DomainId, DomainState>;
  setDomainStatus: (id: DomainId, status: DomainStatus) => void;
  addArtifact: (id: DomainId, artifact: Artifact) => void;
  setProbeSummary: (id: DomainId, summary: ProbeSummary) => void;
  setScaffoldAgents: (id: DomainId, agents: ScaffoldAgent[]) => void;
  setValidationGates: (id: DomainId, gates: ValidationGate[]) => void;
  setSweepSummary: (id: DomainId, summary: SweepSummary) => void;
  setDomainProgress: (id: DomainId, progress: number) => void;
  initializeDomains: () => void;
  resetDomains: () => void;
}

export const useDomainStore = create<DomainStoreState>()(
  persist(
    (set) => ({
      domainStates: createInitialDomains(),

      setDomainStatus: (id, status) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [id]: { ...state.domainStates[id], status },
          },
        })),

      addArtifact: (id, artifact) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [id]: {
              ...state.domainStates[id],
              artifacts: [...state.domainStates[id].artifacts, artifact],
            },
          },
        })),

      setProbeSummary: (id, summary) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [id]: { ...state.domainStates[id], probeSummary: summary },
          },
        })),

      setScaffoldAgents: (id, agents) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [id]: { ...state.domainStates[id], scaffoldAgents: agents },
          },
        })),

      setValidationGates: (id, gates) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [id]: { ...state.domainStates[id], validationGates: gates },
          },
        })),

      setSweepSummary: (id, summary) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [id]: { ...state.domainStates[id], sweepSummary: summary },
          },
        })),

      setDomainProgress: (id, progress) =>
        set((state) => ({
          domainStates: {
            ...state.domainStates,
            [id]: { ...state.domainStates[id], progress },
          },
        })),

      initializeDomains: () => set({ domainStates: createInitialDomains() }),
      resetDomains: () => set({ domainStates: createInitialDomains() }),
    }),
    {
      name: 'harbor-domains',
      version: 1,
      migrate: (persisted: unknown, version: number) => {
        if (version === 0 || !version) {
          // Normalize any invalid domain statuses from old schema
          const state = persisted as DomainStoreState;
          const validStatuses = new Set<string>([
            'untested', 'probe_queued', 'probing', 'probe_complete', 'promoted',
            'redesign', 'rejected', 'scaffold_queued', 'scaffolding', 'scaffold_complete',
            'validation_gate', 'gate_passed', 'gate_failed', 'target_sweep',
            'sweep_complete', 'iterating', 'published', 'ready_to_publish',
            'calibrating', 'needs_review', 'blocked', 'archived',
          ]);
          if (state?.domainStates) {
            for (const id of DOMAIN_IDS) {
              const domain = state.domainStates[id];
              if (domain && !validStatuses.has(domain.status)) {
                domain.status = 'untested';
              }
            }
          }
          return state;
        }
        return persisted as DomainStoreState;
      },
    }
  )
);
