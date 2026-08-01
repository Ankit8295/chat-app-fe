"use client";

import { ReactNode } from "react";
import { cn } from "../../../cn.config";
import Typography from "@/components/ui/typography/typography";
import Avatar from "@/components/ui/avatar/avatar";
import ActionIcon, {
  type ActionIconProps,
} from "@/components/ui/action-icon";

export type UserListItemProps = {
  name: string;
  email?: string;
  image?: string;
  className?: string;
  children?: ReactNode;
  selected?: boolean;
  onClick?: () => void;
};

function UserListItemRoot({
  name,
  email,
  image,
  className,
  children,
  selected = false,
  onClick,
}: UserListItemProps) {
  const content = (
    <>
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

      {children && (
        <div className="flex items-center gap-1 shrink-0">{children}</div>
      )}
    </>
  );

  const rowClassName = cn(
    "flex w-full items-center justify-between rounded-lg border px-3.5 py-2.5 transition-colors shrink-0 gap-3 text-left outline-none",
    selected
      ? "border-primary/40 bg-primary/10"
      : "border-border bg-secondary/20 hover:bg-secondary/35",
    onClick && "cursor-pointer",
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

function UserListItemAction(props: ActionIconProps) {
  return <ActionIcon {...props} />;
}

export const UserListItem = Object.assign(UserListItemRoot, {
  Action: UserListItemAction,
});

export default UserListItem;
