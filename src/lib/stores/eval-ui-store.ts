'use client';

import { create } from 'zustand';

export type EvalTab = 'datasets' | 'rubrics' | 'runs' | 'compare';

interface EvalUIStore {
  open: boolean;
  tab: EvalTab;
  /** Currently inspected run id (opens RunDetail). */
  activeRunId: string | null;
  setOpen: (open: boolean) => void;
  setTab: (tab: EvalTab) => void;
  setActiveRunId: (id: string | null) => void;
  openTo: (tab: EvalTab) => void;
}

export const useEvalUIStore = create<EvalUIStore>((set) => ({
  open: false,
  tab: 'datasets',
  activeRunId: null,
  setOpen: (open) => set({ open }),
  setTab: (tab) => set({ tab, activeRunId: null }),
  setActiveRunId: (activeRunId) => set({ activeRunId }),
  openTo: (tab) => set({ open: true, tab, activeRunId: null }),
}));
