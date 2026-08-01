"use client";

import ActionIcon from "@/components/ui/action-icon";
import Typography from "@/components/ui/typography/typography";
import Logo from "@/icons/logo";
import Avatar from "@/components/ui/avatar/avatar";
import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";

export default function MobileHeader() {
  const t = useTranslations();
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <header className="flex lg:hidden w-full items-center justify-between border-b border-border bg-surface px-4 py-2.5 shrink-0 z-20 shadow-2xs">
      <div className="flex items-center gap-3">
        <Avatar
          icon={<Logo className="size-5 text-primary" />}
          shape="rounded"
          size="md"
        />
        <Typography
          variant="h2"
          className="text-base font-bold text-foreground tracking-tight"
        >
          {t("app-name")}
        </Typography>
      </div>

      <ActionIcon
        name="menu"
        variant="solid"
        label={t("label-open-menu")}
        onClick={toggleSidebar}
      />
    </header>
  );
}
