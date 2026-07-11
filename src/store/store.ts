import { create } from "zustand";

interface LayoutState {
  isSidebarExpanded: boolean;
  activeUserId: string | null;
  setSidebarExpanded: (value: boolean) => void;
  setActiveUserId: (userId: string | null) => void;
  toggleSidebar: () => void;
}

const initialLayoutState: Pick<
  LayoutState,
  "isSidebarExpanded" | "activeUserId"
> = {
  isSidebarExpanded: false,
  activeUserId: null,
};

export const useLayoutStore = create<LayoutState>()((set) => ({
  ...initialLayoutState,
  setSidebarExpanded: (value) => set({ isSidebarExpanded: value }),
  setActiveUserId: (userId) => set({ activeUserId: userId }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
}));
