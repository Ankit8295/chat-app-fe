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
    </div>
  );
}

function UserListItemAction(props: ActionIconProps) {
  return <ActionIcon {...props} />;
}

export const UserListItem = Object.assign(UserListItemRoot, {
  Action: UserListItemAction,
});

export default UserListItem;
