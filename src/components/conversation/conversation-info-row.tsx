"use client";

import { ReactNode } from "react";
import { cn } from "../../../cn.config";
import Typography from "@/components/ui/typography/typography";

type ConversationInfoRowProps = {
  icon: ReactNode;
  label: string;
  description?: string;
  trailing?: ReactNode;
  onClick?: () => void;
  variant?: "default" | "danger";
  className?: string;
};

export default function ConversationInfoRow({
  icon,
  label,
  description,
  trailing,
  onClick,
  variant = "default",
  className,
}: ConversationInfoRowProps) {
  const content = (
    <>
      <span
        className={cn(
          "flex size-6 shrink-0 items-center justify-center",
          variant === "danger" ? "text-destructive" : "text-muted",
        )}
      >
        {icon}
      </span>

      <div className="min-w-0 flex-1">
        <Typography
          variant="span"
          className={cn(
            "block text-sm font-medium",
            variant === "danger" ? "text-destructive" : "text-foreground",
          )}
        >
          {label}
        </Typography>
        {description && (
          <Typography
            variant="span"
            className="mt-0.5 block text-xs text-muted"
          >
            {description}
          </Typography>
        )}
      </div>

      {trailing && <div className="shrink-0">{trailing}</div>}
    </>
  );

  const rowClassName = cn(
    "flex w-full items-center gap-4 px-4 py-3.5 text-left outline-none transition-colors",
    onClick && "cursor-pointer hover:bg-secondary/40",
    className,
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={rowClassName}>
        {content}
      </button>
    );
  }

  return <div className={rowClassName}>{content}</div>;
}
