"use client";
import AppSidebar from "@/components/sidebar/app-sidebar";
import SettingsModal from "@/components/settings/settings-modal";
import ArrowIcon from "@/icons/arrow";
import { useLayoutStore } from "@/store/store";
import { useGetMe } from "@/lib/queries/user/query";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ChatLayout({ children }: Props) {
  const isExpanded = useLayoutStore((state) => state.isSidebarExpanded);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  // Prefetch/Load the logged-in user profile on application layout load.
  // This populates the React Query cache instantly, ensuring we don't trigger the API call when opening the Settings modal.
  useGetMe();

  return (
    <div className="flex h-screen w-full overflow-hidden max-sm:relative">
      <div
        className={`relative border-r border-border bg-surface py-4 transition-all duration-300 max-sm:fixed max-sm:left-0 max-sm:top-0 max-sm:bottom-0 max-sm:z-40 ${
          isExpanded
            ? "w-[max(20%,250px)] max-sm:w-[280px] max-sm:translate-x-0 max-sm:shadow-2xl"
            : "w-[64px] max-sm:w-0 max-sm:-translate-x-full"
        }`}
      >
        <div
          onClick={toggleSidebar}
          className="absolute top-[50px] right-0 z-10 flex translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-background p-1.5 max-sm:top-[20px] max-sm:scale-110"
        >
          <ArrowIcon
            width={12}
            height={12}
            direction={isExpanded ? "left" : "right"}
            className="flex items-center justify-center"
          />
        </div>
        <AppSidebar isExpanded={isExpanded} />
      </div>

      {/* Background Overlay for mobile sidebar back-drop click */}
      {isExpanded && (
        <div
          onClick={toggleSidebar}
          className="hidden max-sm:block fixed inset-0 z-30 bg-black/40 backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Main Chat Layout Area - slides or adjusts space responsive */}
      <div className="bg-background flex-1 overflow-auto transition-all duration-300 max-sm:w-full">
        {children}
      </div>

      <SettingsModal />
    </div>
  );
}
