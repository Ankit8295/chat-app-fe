"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { cn } from "../../../cn.config";
import PanelHeader from "@/components/ui/panel-header";
import { useTranslations } from "next-intl";

type SlidePanelProps = {
  open: boolean;
  onClose: () => void;
  title: ReactNode;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
  size?: "md" | "lg";
};

const sizeClasses = {
  md: "max-lg:max-w-none lg:max-w-md",
  lg: "max-lg:max-w-none lg:max-w-xl",
} as const;

export default function SlidePanel({
  open,
  onClose,
  title,
  children,
  className,
  contentClassName,
  size = "md",
}: SlidePanelProps) {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted) return null;

  return createPortal(
    <>
      <button
        type="button"
        aria-label={t("label-close")}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] transition-opacity duration-300",
          open
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!open}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-hidden bg-surface shadow-2xl",
          "transform-gpu transition-transform duration-300 ease-in-out will-change-transform",
          "max-lg:border-l-0 lg:border-l lg:border-border",
          sizeClasses[size],
          open ? "translate-x-0" : "translate-x-full",
          className,
        )}
      >
        <PanelHeader title={title} onClose={onClose} />
        <div
          className={cn(
            "flex min-h-0 flex-1 flex-col overflow-hidden",
            contentClassName,
          )}
        >
          {children}
        </div>
      </aside>
    </>,
    document.body,
  );
}
