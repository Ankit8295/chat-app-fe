import { create } from "zustand";

interface LayoutState {
  isSidebarExpanded: boolean;
  activeUserId: string | null;
  isSettingsOpen: boolean;
  setSidebarExpanded: (value: boolean) => void;
  setActiveUserId: (userId: string | null) => void;
  toggleSidebar: () => void;
  setSettingsOpen: (value: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()((set) => ({
  isSidebarExpanded: false,
  activeUserId: null,
  isSettingsOpen: false,
  setSidebarExpanded: (value) => set({ isSidebarExpanded: value }),
  setActiveUserId: (userId) => set({ activeUserId: userId }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
  setSettingsOpen: (value) => set({ isSettingsOpen: value }),
}));
