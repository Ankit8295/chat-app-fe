"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { SunIcon } from "@/icons/sun";
import { MoonIcon } from "@/icons/moon";
import { useTranslations } from "next-intl";

export default function ThemeToggle() {
  const t = useTranslations();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      type="button"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="horizontal-center h-9 w-9 rounded-lg border border-border bg-surface transition-colors hover:bg-surface-elevated"
      aria-label={t("label-toggle-theme")}
    >
      {theme === "dark" ? (
        <SunIcon className="text-lg" />
      ) : (
        <MoonIcon className="text-lg" />
      )}
    </button>
  );
}
