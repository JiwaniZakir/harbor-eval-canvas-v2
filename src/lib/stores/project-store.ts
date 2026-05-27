import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Project, TargetModel } from '../types';

interface ProjectState {
  project: Project | null;
  setProject: (project: Project) => void;
  updateProgress: (progress: number) => void;
  setTargetModel: (model: TargetModel) => void;
  resetProject: () => void;
}

export const useProjectStore = create<ProjectState>()(
  persist(
    (set) => ({
      project: null,

      setProject: (project) => set({ project }),

      updateProgress: (progress) =>
        set((state) => ({
          project: state.project
            ? { ...state.project, globalProgress: progress }
            : null,
        })),

      setTargetModel: (model) =>
        set((state) => ({
          project: state.project
            ? { ...state.project, targetModel: model }
            : null,
        })),

      resetProject: () => set({ project: null }),
    }),
    {
      name: 'harbor-project',
    }
  )
);
