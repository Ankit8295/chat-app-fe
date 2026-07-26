"use client";

import AppSidebar from "@/components/sidebar/app-sidebar";
import SettingsModal from "@/components/settings/settings-modal";
import MobileHeader from "@/components/layout/mobile-header";
import ArrowIcon from "@/icons/arrow";
import { useLayoutStore } from "@/store/store";
import { useGetMe, useGetUserPreferences } from "@/lib/queries/user/query";
import { useTranslations } from "next-intl";
import { cn } from "../../cn.config";
import { type ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ChatLayout({ children }: Props) {
  const t = useTranslations();
  const isExpanded = useLayoutStore((state) => state.isSidebarExpanded);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  // Prefetch/Load the logged-in user profile & preferences on application layout load.
  useGetMe();
  useGetUserPreferences();

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      {/* Sidebar Container */}
      <aside
        className={cn(
          "bg-surface pb-4 z-40 shrink-0 transform-gpu ease-in-out duration-300",
          // Below 1024px (max-lg): Fixed overlay drawer layer, hardware-accelerated transform (composite layer, zero reflow)
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:w-[81%] max-lg:border-r max-lg:border-border max-lg:shadow-2xl max-lg:transition-transform max-lg:will-change-transform",
          isExpanded ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
          // 1024px and above (lg): Inline relative sidebar column, hardware-accelerated width/transform composite layer
          "lg:relative lg:inset-auto lg:translate-x-0 lg:border-r lg:border-border lg:shadow-none lg:transition-[width,transform] lg:will-change-[width,transform]",
          isExpanded ? "lg:w-[max(20%,250px)]" : "lg:w-16",
        )}
      >
        <AppSidebar isExpanded={isExpanded} />
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden w-full transition-[width,padding] duration-300 ease-in-out transform-gpu">
        {/* Mobile Header Bar (< 1024px) */}
        <MobileHeader />

        {/* Page Content */}
        <div className="flex-1 overflow-auto min-w-0">{children}</div>
      </div>

      {/* Global Modals */}
      <SettingsModal />
    </div>
  );
}
