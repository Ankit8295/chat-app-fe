"use client";

import AppSidebar from "@/components/sidebar/app-sidebar";
import SettingsModal from "@/components/settings/settings-modal";
import MobileHeader from "@/components/layout/mobile-header";
import { useLayoutStore } from "@/store/store";
import { useGetMe, useGetUserPreferences } from "@/lib/queries/user/query";
import { cn } from "../../cn.config";
import { type ReactNode } from "react";
import { usePathname } from "next/navigation";
import { ROUTES } from "../../routes.config";

type Props = {
  children: ReactNode;
};

export default function ChatLayout({ children }: Props) {
  const pathname = usePathname();
  const isExpanded = useLayoutStore((state) => state.isSidebarExpanded);
  const isConversationRoute = pathname !== ROUTES.HOME;

  useGetMe();
  useGetUserPreferences();

  return (
    <div className="flex h-screen w-full overflow-hidden relative">
      <aside
        className={cn(
          "bg-surface z-40 shrink-0 transform-gpu ease-in-out duration-300",
          // Mobile: full-width overlay drawer
          "max-lg:fixed max-lg:inset-y-0 max-lg:left-0 max-lg:w-full max-lg:shadow-2xl max-lg:transition-transform max-lg:will-change-transform",
          isExpanded ? "max-lg:translate-x-0" : "max-lg:-translate-x-full",
          // Desktop: inline sidebar column
          "lg:relative lg:inset-auto lg:translate-x-0 lg:border-r lg:border-border lg:shadow-none lg:transition-[width,transform] lg:will-change-[width,transform]",
          isExpanded ? "lg:w-[max(20%,250px)]" : "lg:w-16",
        )}
      >
        <AppSidebar isExpanded={isExpanded} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 bg-background overflow-hidden w-full transition-[width,padding] duration-300 ease-in-out transform-gpu">
        {!isConversationRoute && <MobileHeader />}

        <div className="flex-1 overflow-auto min-w-0">{children}</div>
      </div>

      <SettingsModal />
    </div>
  );
}
