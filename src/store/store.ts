import { create } from "zustand";

interface LayoutState {
  isSidebarExpanded: boolean;
  activeConversatoinId: string | null;
  isSettingsOpen: boolean;
  isNewChatOpen: boolean;
  isNewGroupOpen: boolean;
  setSidebarExpanded: (value: boolean) => void;
  setActiveConversationId: (conversationId: string | null) => void;
  toggleSidebar: () => void;
  setSettingsOpen: (value: boolean) => void;
  setNewChatOpen: (value: boolean) => void;
  setNewGroupOpen: (value: boolean) => void;
}

export const useLayoutStore = create<LayoutState>()((set) => ({
  isSidebarExpanded: false,
  activeConversatoinId: null,
  isSettingsOpen: false,
  isNewChatOpen: false,
  isNewGroupOpen: false,
  setSidebarExpanded: (value) => set({ isSidebarExpanded: value }),
  setActiveConversationId: (conversationId) =>
    set({ activeConversatoinId: conversationId }),
  toggleSidebar: () =>
    set((state) => ({ isSidebarExpanded: !state.isSidebarExpanded })),
  setSettingsOpen: (value) => set({ isSettingsOpen: value }),
  setNewChatOpen: (value) => set({ isNewChatOpen: value }),
  setNewGroupOpen: (value) => set({ isNewGroupOpen: value }),
}));
