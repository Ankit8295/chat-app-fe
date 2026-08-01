"use client";

import ActionIcon from "@/components/ui/action-icon";
import Typography from "@/components/ui/typography/typography";
import Logo from "@/icons/logo";
import { useTranslations } from "next-intl";
import { cn } from "../../../cn.config";
import { useLayoutStore } from "@/store/store";
import Avatar from "@/components/ui/avatar/avatar";

export default function SidebarHeader() {
  const t = useTranslations();
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const isExpanded = useLayoutStore((state) => state.isSidebarExpanded);

  return (
    <div
      className={cn(
        "flex w-full items-center relative px-2 border-b border-border py-1.5 max-lg:py-1.5",
        isExpanded ? "gap-3 " : "gap-0",
      )}
    >
      <ActionIcon
        name="arrow"
        direction={isExpanded ? "left" : "right"}
        label={
          isExpanded ? t("label-collapse-sidebar") : t("label-expand-sidebar")
        }
        onClick={toggleSidebar}
        className="hidden lg:flex absolute top-full -translate-y-1/2 right-0 z-20 translate-x-1/2 size-7 rounded-full border border-border bg-surface-elevated text-foreground shadow-2xs hover:bg-primary hover:text-background hover:border-primary hover:scale-110 active:scale-95 focus-visible:ring-2 focus-visible:ring-primary"
        iconClassName="size-3"
      />

      <Avatar
        icon={<Logo className="size-6 text-primary" />}
        shape="rounded"
        size="lg"
      />

      {isExpanded && (
        <Typography
          variant="h3"
          className="min-w-0 flex-1 truncate text-base font-bold text-foreground tracking-tight"
        >
          {t("app-name")}
        </Typography>
      )}

      <ActionIcon
        name="x"
        label={t("label-close")}
        onClick={toggleSidebar}
        className="ml-auto lg:hidden"
      />
    </div>
  );
}
