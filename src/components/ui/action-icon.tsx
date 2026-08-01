"use client";

import { type ComponentProps, type ComponentType } from "react";
import { cn } from "../../../cn.config";
import ArrowIcon from "@/icons/arrow";
import MenuIcon from "@/icons/menu";
import MoreIcon from "@/icons/more";
import PencilIcon from "@/icons/pencil";
import SearchIcon from "@/icons/search";
import XIcon from "@/icons/x";

const iconMap = {
  arrow: ArrowIcon,
  menu: MenuIcon,
  more: MoreIcon,
  pencil: PencilIcon,
  search: SearchIcon,
  x: XIcon,
} as const;

export type ActionIconName = keyof typeof iconMap;
export type ActionIconVariant = "default" | "solid";
type ArrowDirection = NonNullable<
  ComponentProps<typeof ArrowIcon>["direction"]
>;

type ActionIconProps = {
  name: ActionIconName;
  label: string;
  title?: string;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  iconClassName?: string;
  variant?: ActionIconVariant;
  direction?: ArrowDirection;
};

const variantClasses: Record<ActionIconVariant, string> = {
  default:
    "size-8 rounded-xl text-foreground/70 hover:bg-secondary hover:text-primary",
  solid:
    "size-8 rounded-xl bg-secondary border border-border text-foreground hover:bg-tertiary hover:text-primary ",
};

export default function ActionIcon({
  name,
  label,
  title,
  onClick,
  disabled = false,
  className,
  iconClassName,
  variant = "default",
  direction,
}: ActionIconProps) {
  const Icon = iconMap[name] as ComponentType<
    ComponentProps<"svg"> & { direction?: ArrowDirection }
  >;

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      title={title ?? label}
      className={cn(
        "inline-flex shrink-0 items-center justify-center transition-colors cursor-pointer outline-none disabled:opacity-50 disabled:cursor-default",
        variantClasses[variant],
        className,
      )}
    >
      <Icon
        className={cn("size-5", iconClassName)}
        {...(name === "arrow" ? { direction } : {})}
      />
    </button>
  );
}
