"use client";

import { User } from "@/lib/queries/user/types";
import { cn } from "../../../cn.config";
import Typography from "@/components/ui/typography/typography";
import Avatar from "@/components/ui/avatar/avatar";

type Props = {
  user: User;
  isActive?: boolean;
  isExpanded?: boolean;
  isOnline?: boolean;
  onClick?: () => void;
};

export default function SidebarUserItem({
  user,
  isActive = false,
  isExpanded = false,
  isOnline = false,
  onClick,
}: Props) {
  return (
    <button
      type="button"
      title={user.name}
      onClick={onClick}
      className={cn(
        "group relative flex w-full px-2 shrink-0 items-center justify-start gap-3 rounded-lg rounded-tl-none rounded-bl-none outline-none cursor-pointer",
        isActive && "bg-secondary",
      )}
    >
      <span
        aria-hidden
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 w-1 h-full rounded-r-full bg-primary transform-gpu transition-transform duration-200 origin-center will-change-transform",
          isActive
            ? "scale-y-100 opacity-100"
            : "scale-y-0 opacity-0 group-hover:scale-y-50 group-hover:opacity-100",
        )}
      />

      <Avatar
        src={user.img}
        name={user.name || user.email}
        isActive={isActive}
        isOnline={isOnline}
        shape="rounded"
        size="lg"
      />

      {isExpanded && (
        <Typography
          variant="span"
          className={cn(
            "min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-primary",
            isActive && "text-primary font-semibold",
          )}
        >
          {user.name}
        </Typography>
      )}
    </button>
  );
}
