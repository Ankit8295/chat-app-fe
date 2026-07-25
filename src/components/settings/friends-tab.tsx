"use client";

import React from "react";
import { useGetAllFriends } from "@/lib/queries/user/query";
import { useTranslations } from "next-intl";
import Typography from "@/components/ui/typography/typography";
import FriendItem from "./friend-item";

export default function FriendsTab() {
  const t = useTranslations();
  const { data: friendsList = [], isLoading: isUsersLoading } = useGetAllFriends();

  if (isUsersLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-10 my-auto">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent"></div>
        <Typography variant="span" className="text-muted">
          {t("label-loading-friends") || "Loading friends..."}
        </Typography>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 max-sm:gap-4">
      <div>
        <Typography variant="span" className="text-xs font-bold uppercase tracking-wider text-muted mb-2 block">
          {t("label-manage-friends") || "Active Friends"} ({friendsList.length})
        </Typography>

        {friendsList.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-6 text-center">
            <Typography variant="span" className="text-muted">
              {t("label-no-friends") || "No friends found."}
            </Typography>
          </div>
        ) : (
          <div className="flex flex-col gap-2 max-h-[350px] max-sm:max-h-[300px] overflow-y-auto pr-1">
            {friendsList.map((friend) => (
              <FriendItem
                key={friend.id}
                friend={friend}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
