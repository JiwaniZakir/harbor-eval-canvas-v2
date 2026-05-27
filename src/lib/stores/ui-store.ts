import { create } from 'zustand';
import type { TabId, DomainId, GlobalState } from '../types';

interface UIState {
  activeTab: TabId;
  focusedDomainId: DomainId | null;
  setupWizardOpen: boolean;
  globalState: GlobalState;
  commandPaletteOpen: boolean;
  projectDropdownOpen: boolean;
  setActiveTab: (tab: TabId) => void;
  setFocusedDomain: (id: DomainId | null) => void;
  setSetupWizardOpen: (open: boolean) => void;
  setGlobalState: (state: GlobalState) => void;
  toggleCommandPalette: () => void;
  setCommandPaletteOpen: (open: boolean) => void;
  setProjectDropdownOpen: (open: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: 'home',
  focusedDomainId: null,
  setupWizardOpen: false,
  globalState: 'empty',
  commandPaletteOpen: false,
  projectDropdownOpen: false,

  setActiveTab: (tab) => set({ activeTab: tab }),

  setFocusedDomain: (id) => set({ focusedDomainId: id }),

  setSetupWizardOpen: (open) => set({ setupWizardOpen: open }),

  setGlobalState: (state) => set({ globalState: state }),

  toggleCommandPalette: () =>
    set((s) => ({ commandPaletteOpen: !s.commandPaletteOpen })),

  setCommandPaletteOpen: (open) => set({ commandPaletteOpen: open }),

  setProjectDropdownOpen: (open) => set({ projectDropdownOpen: open }),
}));
