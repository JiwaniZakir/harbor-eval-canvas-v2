import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, TargetModel } from '../types';
import {
  createProject as createProjectAction,
  updateProject as updateProjectAction,
  deleteProject as deleteProjectAction,
  listProjects as listProjectsAction,
} from '../actions/projects';
import { useToastStore } from './toast-store';

/* ================================================================
   Project store — Postgres is the source of truth.

   - `persist` middleware stays on as an OFFLINE CACHE only; every
     mutation writes through to Supabase via server actions and the
     server response reconciles the cached copy.
   - C4: mutations apply optimistically, then reconcile with the
     server. On error we roll back to the prior snapshot and toast.

   The public store API (setProject / updateProgress / setTargetModel
   / resetProject) is preserved so existing components keep working.
   New async helpers (hydrate / createProject) back the persistence.
   ================================================================ */

function toast(message: string, type: 'error' | 'success' | 'info' = 'error') {
  useToastStore.getState().addToast(message, type);
}

interface ProjectState {
  project: Project | null;
  hydrated: boolean;

  // --- preserved synchronous API (now write-through) ---
  setProject: (project: Project) => void;
  updateProgress: (progress: number) => void;
  setTargetModel: (model: TargetModel) => void;
  resetProject: () => void;

  // --- new persistence API ---
  /** Fetch the most recent project (and its id) for the signed-in user. */
  hydrate: () => Promise<void>;
  /** Persist a brand-new project, returning the row with its id. */
  createProject: (project: Project) => Promise<Project | null>;
  /** Hard delete the current project from Postgres. */
  deleteProject: () => Promise<void>;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set, get) => ({
      project: null,
      hydrated: false,

      // Hydrate from the server: pick the latest project for this user.
      hydrate: async () => {
        const res = await listProjectsAction();
        if (!res.ok) {
          set({ hydrated: true });
          return;
        }
        if (res.data.length === 0) {
          set({ project: null, hydrated: true });
          return;
        }
        // Load the full project (it already includes everything we need).
        set({ project: res.data[0], hydrated: true });
      },

      // Persist a new project. The wizard calls this; it replaces the local
      // optimistic copy with the server row (which carries the real id).
      createProject: async (project) => {
        const prev = get().project;
        // Optimistic: show it immediately (no id yet).
        set({ project });
        const res = await createProjectAction({
          name: project.name,
          targetModel: project.targetModel,
          workflowDescription: project.workflowDescription,
          globalProgress: project.globalProgress,
        });
        if (!res.ok) {
          set({ project: prev }); // rollback
          toast(`Failed to create project: ${res.error}`);
          return null;
        }
        set({ project: res.data });
        return res.data;
      },

      // setProject: if it has an id it's already persisted (reconcile), else
      // create it. This keeps the synchronous call site working.
      setProject: (project) => {
        if (project.id) {
          set({ project });
          return;
        }
        // Fire the create write-through; component stays in sync via store.
        void get().createProject(project);
        set({ project });
      },

      updateProgress: (progress) => {
        const prev = get().project;
        if (!prev) return;
        const next = { ...prev, globalProgress: progress };
        set({ project: next }); // optimistic
        if (!prev.id) return; // not yet persisted; nothing to write through
        void (async () => {
          const res = await updateProjectAction({ id: prev.id!, globalProgress: progress });
          if (!res.ok) {
            set({ project: prev });
            toast(`Failed to save progress: ${res.error}`);
          }
        })();
      },

      setTargetModel: (model) => {
        const prev = get().project;
        if (!prev) return;
        const next = { ...prev, targetModel: model };
        set({ project: next }); // optimistic
        if (!prev.id) return;
        void (async () => {
          const res = await updateProjectAction({ id: prev.id!, targetModel: model });
          if (!res.ok) {
            set({ project: prev });
            toast(`Failed to save model: ${res.error}`);
          }
        })();
      },

      // resetProject clears the local view (used after delete). It does not
      // itself delete from Postgres; use deleteProject for that.
      resetProject: () => set({ project: null }),

      deleteProject: async () => {
        const prev = get().project;
        if (!prev?.id) {
          set({ project: null });
          return;
        }
        set({ project: null }); // optimistic
        const res = await deleteProjectAction(prev.id);
        if (!res.ok) {
          set({ project: prev });
          toast(`Failed to delete project: ${res.error}`);
        }
      },
    }),
    {
      name: 'harbor-project',
      // Only cache the project view; never the transient hydrated flag.
      partialize: (state) => ({ project: state.project }),
    },
  ),
);

