"use client";

import React, { ReactNode } from "react";
import { cn } from "../../../cn.config";
import Typography from "@/components/ui/typography/typography";
import Avatar from "@/components/ui/avatar/avatar";

export type UserListItemProps = {
  name: string;
  email?: string;
  image?: string;
  className?: string;
  children?: ReactNode;
};

export type UserListItemActionProps = {
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
  variant?: "default" | "danger";
  children: ReactNode;
  className?: string;
};

function UserListItemRoot({
  name,
  email,
  image,
  className,
  children,
}: UserListItemProps) {
  return (
    <div
      className={cn(
        "flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3.5 py-2.5 hover:bg-secondary/35 transition-colors shrink-0 gap-3",
        className,
      )}
    >
      {/* Left Column: Avatar + Name & Email */}
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <Avatar name={name || email} src={image} size="md" shape="rounded" />
        <div className="min-w-0 flex-1">
          <Typography
            variant="span"
            className="block truncate font-medium text-sm text-foreground"
          >
            {name}
          </Typography>
          {email && (
            <Typography
              variant="span"
              className="block truncate text-xs text-muted"
            >
              {email}
            </Typography>
          )}
        </div>
      </div>

      {/* Right Column: Actions Slot */}
      {children && (
        <div className="flex items-center gap-1 shrink-0">{children}</div>
      )}
    </div>
  );
}

function UserListItemAction({
  onClick,
  disabled = false,
  title,
  variant = "default",
  children,
  className,
}: UserListItemActionProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onClick}
      title={title}
      className={cn(
        "flex items-center justify-center rounded-lg p-2 transition-colors cursor-pointer outline-none shrink-0 disabled:opacity-50",
        variant === "default" &&
          "text-foreground/70 hover:bg-primary/20 hover:text-primary",
        variant === "danger" &&
          "text-foreground/50 hover:bg-destructive/10 hover:text-destructive",
        className,
      )}
    >
      {children}
    </button>
  );
}

export const UserListItem = Object.assign(UserListItemRoot, {
  Action: UserListItemAction,
});

export default UserListItem;
