"use client";

import Typography from "@/components/ui/typography/typography";
import Logo from "@/icons/logo";
import { useTranslations } from "next-intl";
import { cn } from "../../../cn.config";
import { useLayoutStore } from "@/store/store";
import ArrowIcon from "@/icons/arrow";
import XIcon from "@/icons/x";
import Avatar from "@/components/ui/avatar/avatar";

export default function SidebarHeader() {
  const t = useTranslations();
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);
  const isExpanded = useLayoutStore((state) => state.isSidebarExpanded);

  return (
    <div
      className={cn(
        "flex w-full items-center relative px-2 border-b border-border py-2 max-lg:py-1.5",
        isExpanded ? "gap-3 " : "gap-0",
      )}
    >
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={
          isExpanded ? t("label-collapse-sidebar") : t("label-expand-sidebar")
        }
        title={
          isExpanded ? t("label-collapse-sidebar") : t("label-expand-sidebar")
        }
        className="hidden lg:flex absolute top-full -translate-y-1/2 right-0 z-20 translate-x-1/2 size-7 cursor-pointer items-center justify-center rounded-full border border-border bg-surface-elevated text-foreground shadow-2xs transform-gpu transition-transform duration-200 hover:bg-primary hover:text-background hover:border-primary hover:scale-110 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
      >
        <ArrowIcon
          width={12}
          height={12}
          direction={isExpanded ? "left" : "right"}
          className="flex items-center justify-center stroke-current"
        />
      </button>

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

      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={t("label-close")}
        title={t("label-close")}
        className="ml-auto flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground/70 hover:bg-secondary hover:text-primary transition-colors cursor-pointer outline-none lg:hidden"
      >
        <XIcon className="size-5" />
      </button>
    </div>
  );
}
