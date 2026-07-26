"use client";

import Typography from "@/components/ui/typography/typography";
import Logo from "@/icons/logo";
import MenuIcon from "@/icons/menu";
import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";

export default function MobileHeader() {
  const t = useTranslations();
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <header className="flex lg:hidden w-full items-center justify-between border-b border-border bg-surface px-2 py-2.5 shrink-0 z-20 shadow-2xs">
      {/* Left: App Logo Badge & Name */}
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary border border-border shadow-2xs">
          <Logo className="size-5 text-primary" />
        </div>
        <Typography
          variant="h2"
          className="text-base font-bold text-foreground tracking-tight"
        >
          {t("app-name")}
        </Typography>
      </div>

      {/* Right: Menu Trigger Button */}
      <button
        type="button"
        onClick={toggleSidebar}
        aria-label={t("label-open-menu")}
        title={t("label-open-menu")}
        className="flex size-10 items-center justify-center rounded-xl bg-secondary border border-border text-foreground hover:bg-tertiary hover:text-primary transition-colors cursor-pointer outline-none active:scale-95"
      >
        <MenuIcon className="size-5 stroke-current" />
      </button>
    </header>
  );
}
