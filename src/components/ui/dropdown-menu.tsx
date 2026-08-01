"use client";

import { type ComponentPropsWithoutRef, type ReactNode } from "react";
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu";
import { cn } from "../../../cn.config";
import Typography from "@/components/ui/typography/typography";

function DropdownMenuRoot({
  children,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Root>) {
  return (
    <DropdownMenuPrimitive.Root {...props}>{children}</DropdownMenuPrimitive.Root>
  );
}

function DropdownMenuTrigger({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      className={cn("outline-none", className)}
      {...props}
    />
  );
}

type DropdownMenuContentProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Content
> & {
  sideOffset?: number;
};

function DropdownMenuContent({
  className,
  sideOffset = 8,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        sideOffset={sideOffset}
        className={cn(
          "z-50 min-w-48 overflow-hidden rounded-xl border border-border bg-surface-elevated p-1 shadow-2xl outline-none",
          "data-[state=open]:animate-fade-in",
          className,
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

type DropdownMenuItemProps = ComponentPropsWithoutRef<
  typeof DropdownMenuPrimitive.Item
> & {
  icon?: ReactNode;
};

function DropdownMenuItem({
  className,
  icon,
  children,
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "flex cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 outline-none select-none",
        "text-sm font-medium text-foreground",
        "data-highlighted:bg-secondary data-highlighted:text-primary",
        "data-disabled:pointer-events-none data-disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {icon && (
        <span className="flex size-5 shrink-0 items-center justify-center text-muted">
          {icon}
        </span>
      )}
      <Typography variant="span" className="min-w-0 flex-1 truncate">
        {children}
      </Typography>
    </DropdownMenuPrimitive.Item>
  );
}

function DropdownMenuSeparator({
  className,
  ...props
}: ComponentPropsWithoutRef<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      className={cn("my-1 h-px bg-border", className)}
      {...props}
    />
  );
}

export const DropdownMenu = Object.assign(DropdownMenuRoot, {
  Trigger: DropdownMenuTrigger,
  Content: DropdownMenuContent,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
});

export default DropdownMenu;
