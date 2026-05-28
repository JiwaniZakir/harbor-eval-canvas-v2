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
import {
  upsertDomain as upsertDomainAction,
  listDomains as listDomainsAction,
  initializeProjectDomains as initDomainsAction,
} from '../actions/projects';
import type { UpsertDomainInput } from '../validation/persistence';
import { useProjectStore } from './project-store';
import { useToastStore } from './toast-store';

/* ================================================================
   Domain store — Postgres source of truth, localStorage = cache.

   Per-domain state lives in the `domains` table keyed by
   (project_id, domain_key). Every mutation:
     1. applies optimistically to the in-memory map,
     2. writes through to Supabase via `upsertDomain`,
     3. on error, rolls back to the prior snapshot and toasts (C4).

   The store API is unchanged so eval-pipeline.ts and the canvas
   components keep working untouched.
   ================================================================ */

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

function currentProjectId(): string | null {
  return useProjectStore.getState().project?.id ?? null;
}

function toast(message: string) {
  useToastStore.getState().addToast(message, 'error');
}

interface DomainStoreState {
  domainStates: Record<DomainId, DomainState>;
  hydrated: boolean;

  setDomainStatus: (id: DomainId, status: DomainStatus) => void;
  addArtifact: (id: DomainId, artifact: Artifact) => void;
  setProbeSummary: (id: DomainId, summary: ProbeSummary) => void;
  setScaffoldAgents: (id: DomainId, agents: ScaffoldAgent[]) => void;
  setValidationGates: (id: DomainId, gates: ValidationGate[]) => void;
  setSweepSummary: (id: DomainId, summary: SweepSummary) => void;
  setDomainProgress: (id: DomainId, progress: number) => void;
  initializeDomains: () => void;
  resetDomains: () => void;

  /** Hydrate domain states for a project from Postgres. */
  hydrate: (projectId: string) => Promise<void>;
}

export const useDomainStore = create<DomainStoreState>()(
  persist(
    (set, get) => {
      /**
       * C4 core: optimistically mutate one domain, write the changed fields
       * through to Postgres, and roll back on failure.
       */
      const mutate = (
        id: DomainId,
        patch: Partial<DomainState>,
        writePatch: Omit<UpsertDomainInput, 'projectId' | 'domainKey'>,
      ) => {
        const prevAll = get().domainStates;
        const prev = prevAll[id];
        const next = { ...prev, ...patch };
        set({ domainStates: { ...prevAll, [id]: next } }); // optimistic

        const projectId = currentProjectId();
        if (!projectId) return; // no persisted project yet (offline/new)

        void (async () => {
          const res = await upsertDomainAction({
            projectId,
            domainKey: id,
            ...writePatch,
          });
          if (!res.ok) {
            set({ domainStates: { ...get().domainStates, [id]: prev } }); // rollback
            toast(`Failed to save ${id}: ${res.error}`);
          }
        })();
      };

      return {
        domainStates: createInitialDomains(),
        hydrated: false,

        setDomainStatus: (id, status) =>
          mutate(id, { status }, { status }),

        addArtifact: (id, artifact) => {
          const artifacts = [...get().domainStates[id].artifacts, artifact];
          mutate(id, { artifacts }, { artifacts });
        },

        setProbeSummary: (id, summary) =>
          mutate(id, { probeSummary: summary }, { probeSummary: summary }),

        setScaffoldAgents: (id, agents) =>
          mutate(id, { scaffoldAgents: agents }, { scaffoldAgents: agents }),

        setValidationGates: (id, gates) =>
          mutate(id, { validationGates: gates }, { validationGates: gates }),

        setSweepSummary: (id, summary) =>
          mutate(id, { sweepSummary: summary }, { sweepSummary: summary }),

        setDomainProgress: (id, progress) =>
          mutate(id, { progress }, { progress }),

        // Reset the in-memory map and seed all rows server-side (idempotent).
        initializeDomains: () => {
          set({ domainStates: createInitialDomains() });
          const projectId = currentProjectId();
          if (!projectId) return;
          void (async () => {
            const res = await initDomainsAction(projectId, DOMAIN_IDS);
            if (!res.ok) {
              toast(`Failed to initialize domains: ${res.error}`);
            }
          })();
        },

        resetDomains: () => {
          set({ domainStates: createInitialDomains() });
          const projectId = currentProjectId();
          if (!projectId) return;
          void (async () => {
            const res = await initDomainsAction(projectId, DOMAIN_IDS);
            if (!res.ok) toast(`Failed to reset domains: ${res.error}`);
          })();
        },

        hydrate: async (projectId) => {
          const res = await listDomainsAction(projectId);
          if (!res.ok) {
            set({ hydrated: true });
            return;
          }
          const map = createInitialDomains();
          for (const d of res.data) {
            map[d.id] = d;
          }
          set({ domainStates: map, hydrated: true });
        },
      };
    },
    {
      name: 'harbor-domains',
      version: 1,
      partialize: (state) => ({ domainStates: state.domainStates }),
      migrate: (persisted: unknown, version: number) => {
        if (version === 0 || !version) {
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
    },
  ),
);
