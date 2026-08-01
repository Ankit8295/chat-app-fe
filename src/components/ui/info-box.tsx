"use client";

import React, { ReactNode } from "react";
import Typography from "@/components/ui/typography/typography";
import { cn } from "../../../cn.config";

export interface InfoBoxProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  children?: ReactNode;
  className?: string;
  iconContainerClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
}

export function InfoBox({
  icon,
  title,
  description,
  children,
  className,
  iconContainerClassName,
  titleClassName,
  descriptionClassName,
}: InfoBoxProps) {
  return (
    <div
      className={cn(
        "flex h-fit w-full flex-col items-center justify-center gap-4 p-6 text-center",
        className,
      )}
    >
      {icon && (
        <div
          className={cn(
            "flex size-20 items-center justify-center rounded-full bg-secondary text-primary shrink-0",
            iconContainerClassName,
          )}
        >
          {icon}
        </div>
      )}
      <div className="max-w-md space-y-1.5">
        <Typography
          variant="h2"
          className={cn("text-xl font-bold text-foreground", titleClassName)}
        >
          {title}
        </Typography>
        {description && (
          <Typography
            variant="p"
            className={cn("text-sm text-muted", descriptionClassName)}
          >
            {description}
          </Typography>
        )}
      </div>
      {children}
    </div>
  );
}

export default InfoBox;
