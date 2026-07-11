"use client";
import AppSidebar from "@/components/sidebar/app-sidebar";
import ArrowIcon from "@/icons/arrow";
import { useLayoutStore } from "@/store/store";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function ChatLayout({ children }: Props) {
  const isExpanded = useLayoutStore((state) => state.isSidebarExpanded);
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <div className="flex h-screen w-full overflow-hidden">
      <div
        className={`relative border-r border-border bg-surface py-4 transition-all duration-300 ${
          isExpanded ? "w-[max(20%,250px)]" : "w-[64px]"
        }`}
      >
        <div
          onClick={toggleSidebar}
          className="absolute top-[50px] right-0 z-10 flex translate-x-1/2 cursor-pointer items-center justify-center rounded-full border border-border bg-background p-1"
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
      <div className="bg-background flex-1 overflow-auto">{children}</div>
    </div>
  );
}
