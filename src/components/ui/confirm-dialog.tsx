"use client";

import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { useTranslations } from "next-intl";
import Button from "@/components/ui/buttons/button";
import PanelHeader from "@/components/ui/panel-header";
import Typography from "@/components/ui/typography/typography";
import { cn } from "../../../cn.config";

type ConfirmDialogProps = {
  open: boolean;
  title: ReactNode;
  description: ReactNode;
  confirmLabel: string;
  cancelLabel?: string;
  isPending?: boolean;
  error?: string | null;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  cancelLabel,
  isPending = false,
  error,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  const t = useTranslations();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !isPending) onCancel();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, isPending, onCancel]);

  if (!mounted || !open) return null;

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <button
        type="button"
        aria-label={t("label-close")}
        onClick={() => {
          if (!isPending) onCancel();
        }}
        className="absolute inset-0 bg-black/40 backdrop-blur-[1px] animate-fade-in"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        className={cn(
          "relative z-10 flex w-full max-w-sm flex-col overflow-hidden rounded-2xl border border-border bg-surface-elevated shadow-2xl animate-scale-up",
        )}
      >
        <PanelHeader
          title={title}
          onClose={() => {
            if (!isPending) onCancel();
          }}
        />
        <div className="flex flex-col gap-4 p-4">
          <Typography variant="p" className="text-sm text-muted">
            {description}
          </Typography>
          {error ? (
            <Typography variant="span" className="text-sm text-destructive">
              {error}
            </Typography>
          ) : null}
          <div className="flex gap-2">
            <Button
              type="button"
              variant="bordered"
              color="secondary"
              className="bg-secondary"
              disabled={isPending}
              onClick={onCancel}
            >
              {cancelLabel ?? t("label-cancel")}
            </Button>
            <Button
              type="button"
              color="destructive"
              disabled={isPending}
              onClick={onConfirm}
            >
              {confirmLabel}
            </Button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
