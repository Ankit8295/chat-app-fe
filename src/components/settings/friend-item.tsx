"use client";

import React from "react";
import { User } from "@/lib/queries/user/types";
import { useTranslations } from "next-intl";
import { getInitials } from "@/utils/string";
import Typography from "@/components/ui/typography/typography";
import TrashIcon from "@/icons/trash";
import BlockIcon from "@/icons/block";

interface FriendItemProps {
  friend: User;
}

export default function FriendItem({ friend }: FriendItemProps) {
  const t = useTranslations();
  const initials = getInitials(friend.name || friend.email);

  return (
    <div className="flex items-center justify-between rounded-lg border border-border bg-secondary/20 px-3 py-2 hover:bg-secondary/35 transition-colors">
      <div className="flex items-center gap-3 min-w-0">
        <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-foreground shrink-0">
          {friend.img ? (
            <img
              src={friend.img}
              alt={friend.name}
              className="size-full rounded-full object-cover"
            />
          ) : (
            initials
          )}
        </span>
        <div className="min-w-0">
          <Typography
            variant="span"
            className="block truncate font-medium text-sm text-foreground"
          >
            {friend.name}
          </Typography>
        </div>
      </div>

      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          onClick={() => console.log("Future API call: remove friend", friend.id)}
          title={t("label-remove") || "Remove"}
          className="rounded-md p-1.5 text-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer outline-none"
        >
          <TrashIcon className="size-4 max-sm:size-[18px]" />
        </button>
        <button
          type="button"
          onClick={() => console.log("Future API call: block user", friend.id)}
          title={t("label-block") || "Block"}
          className="rounded-md p-1.5 text-foreground/50 hover:bg-destructive/10 hover:text-destructive transition-colors cursor-pointer outline-none"
        >
          <BlockIcon className="size-4 max-sm:size-[18px]" />
        </button>
      </div>
    </div>
  );
}
