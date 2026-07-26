"use client";

import React, { ReactNode } from "react";
import * as RadixAvatar from "@radix-ui/react-avatar";
import { cn } from "../../../../cn.config";
import { getInitials } from "@/utils/string";

export type AvatarSize = "sm" | "md" | "lg" | "xl";
export type AvatarShape = "rounded" | "circle";

export interface AvatarProps {
  src?: string;
  name?: string;
  icon?: ReactNode;
  fallback?: ReactNode;
  size?: AvatarSize;
  shape?: AvatarShape;
  isActive?: boolean;
  isOnline?: boolean;
  className?: string;
  imageClassName?: string;
  fallbackClassName?: string;
}

const sizeClasses: Record<AvatarSize, string> = {
  sm: "size-8 text-xs font-semibold",
  md: "size-10 text-sm font-semibold",
  lg: "size-12 text-base font-semibold",
  xl: "size-16 text-lg font-bold",
};

const shapeClasses: Record<AvatarShape, string> = {
  rounded: "rounded-xl",
  circle: "rounded-full",
};

export function Avatar({
  src,
  name,
  icon,
  fallback,
  size = "lg",
  shape = "rounded",
  isActive = false,
  isOnline = false,
  className,
  imageClassName,
  fallbackClassName,
}: AvatarProps) {
  const initials = name ? getInitials(name) : "";

  return (
    <span className="relative inline-flex shrink-0">
      <RadixAvatar.Root
        className={cn(
          "relative flex items-center justify-center overflow-hidden border border-border bg-secondary transition-colors duration-200 select-none shrink-0",
          sizeClasses[size],
          shapeClasses[shape],
          isActive
            ? "text-primary font-bold"
            : "text-foreground group-hover:text-primary",
          className,
        )}
      >
        {src ? (
          <RadixAvatar.Image
            src={src}
            alt={name || "Avatar"}
            className={cn("size-full object-cover", imageClassName)}
          />
        ) : null}

        <RadixAvatar.Fallback
          className={cn(
            "flex size-full items-center justify-center bg-secondary font-semibold transition-colors duration-200",
            isActive
              ? "text-primary"
              : "text-foreground group-hover:text-primary",
            fallbackClassName,
          )}
        >
          {fallback ?? icon ?? initials ?? "?"}
        </RadixAvatar.Fallback>
      </RadixAvatar.Root>

      {isOnline && (
        <span
          aria-label="Online"
          className="absolute -right-0.5 -bottom-0.5 size-3 rounded-full border-2 border-surface bg-success-text z-10"
        />
      )}
    </span>
  );
}

export default Avatar;
