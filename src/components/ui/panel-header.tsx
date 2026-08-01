"use client";

import ActionIcon from "@/components/ui/action-icon";
import Typography from "@/components/ui/typography/typography";
import { useTranslations } from "next-intl";
import { cn } from "../../../cn.config";
import { type ReactNode } from "react";

type PanelHeaderProps = {
  title: ReactNode;
  onClose: () => void;
  className?: string;
  trailing?: ReactNode;
};

export default function PanelHeader({
  title,
  onClose,
  className,
  trailing,
}: PanelHeaderProps) {
  const t = useTranslations();

  return (
    <div
      className={cn(
        "flex shrink-0 items-center justify-between gap-3 border-b border-border px-2.5 py-3.5",
        className,
      )}
    >
      <div className="min-w-0 flex-1">
        {typeof title === "string" ? (
          <Typography
            variant="h2"
            className="truncate text-base font-semibold text-foreground"
          >
            {title}
          </Typography>
        ) : (
          title
        )}
      </div>
      {trailing}
      <ActionIcon name="x" label={t("label-close")} onClick={onClose} />
    </div>
  );
}
