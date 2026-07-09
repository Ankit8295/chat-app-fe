import { create } from 'zustand';

interface LayoutState {
  isSidebarExpanded: boolean;
  setSidebarExpanded: (value: boolean) => void;
  toggleSidebar: () => void;
}

const initialLayoutState: Pick<LayoutState, 'isSidebarExpanded'> = {
  isSidebarExpanded: false,
};

export const useLayoutStore = create<LayoutState>()((set) => ({
  ...initialLayoutState,
  setSidebarExpanded: (value) => set({ isSidebarExpanded: value }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
}));
