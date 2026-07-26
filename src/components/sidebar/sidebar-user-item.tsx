"use client";

import { User } from "@/lib/queries/user/types";
import { cn } from "../../../cn.config";
import { getInitials } from "@/utils/string";
import Typography from "@/components/ui/typography/typography";
import { useTranslations } from "next-intl";

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
  const t = useTranslations();
  const initials = getInitials(user.name || user.email);

  return (
    <button
      type="button"
      title={user.name}
      onClick={onClick}
      className={cn(
        "group relative flex w-full px-2 shrink-0 items-center justify-start gap-3 rounded-lg rounded-tl-none rounded-bl-none outline-none cursor-pointer",
        isActive && "bg-secondary ",
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

      <span className="relative shrink-0">
        <span
          className={cn(
            "flex size-12 items-center hover:text-primary rounded-full justify-center overflow-hidden bg-secondary text-sm font-semibold text-foreground transition-[border-radius] duration-200 ",
            isActive && "text-primary",
          )}
        >
          {user.img ? (
            <img
              src={user.img}
              alt={user.name}
              className="size-full object-cover"
            />
          ) : (
            initials
          )}
        </span>

        {isOnline && (
          <span
            aria-label={t("label-online")}
            className="absolute right-0 bottom-0 size-3 rounded-full border-2 border-surface bg-success-text"
          />
        )}
      </span>

      {isExpanded && (
        <Typography
          variant="span"
          className={cn(
            "min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground",
            isActive && "text-primary",
          )}
        >
          {user.name}
        </Typography>
      )}
    </button>
  );
}
