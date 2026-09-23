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

const EXIT_MS = 300;

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
  const [rendered, setRendered] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (open) {
      setRendered(true);
      let inner = 0;
      const outer = requestAnimationFrame(() => {
        inner = requestAnimationFrame(() => setEntered(true));
      });
      return () => {
        cancelAnimationFrame(outer);
        cancelAnimationFrame(inner);
      };
    }

    setEntered(false);
    const timeout = window.setTimeout(() => setRendered(false), EXIT_MS);
    return () => window.clearTimeout(timeout);
  }, [open]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, onClose]);

  if (!mounted || !rendered) return null;

  const visible = open && entered;

  return createPortal(
    <>
      <button
        type="button"
        aria-label={t("label-close")}
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-50 bg-black/40 transition-opacity duration-300",
          visible
            ? "opacity-100 pointer-events-auto backdrop-blur-[1px]"
            : "opacity-0 pointer-events-none",
        )}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-hidden={!visible}
        className={cn(
          "fixed inset-y-0 right-0 z-50 flex w-full flex-col overflow-hidden bg-surface",
          "transform-gpu transition-transform duration-300 ease-in-out will-change-transform",
          "max-lg:border-l-0 lg:border-l lg:border-border",
          sizeClasses[size],
          visible ? "translate-x-0 shadow-2xl" : "translate-x-full shadow-none",
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
