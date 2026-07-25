"use client";

import { Friend } from "@/lib/queries/user/types";
import { useTranslations } from "next-intl";
import { UserListItem } from "@/components/ui/user-list-item";
import TrashIcon from "@/icons/trash";
import BlockIcon from "@/icons/block";

interface FriendItemProps {
  friend: Friend;
}

export default function FriendItem({ friend }: FriendItemProps) {
  const t = useTranslations();

  return (
    <UserListItem
      name={friend.name}
      email={friend.email}
      image={friend.profileImage}
    >
      <UserListItem.Action
        onClick={() =>
          console.log("Future API call: remove friend", friend.userId)
        }
        title={t("label-remove")}
        variant="danger"
      >
        <TrashIcon className="size-4 max-sm:size-[18px]" />
      </UserListItem.Action>

      <UserListItem.Action
        onClick={() =>
          console.log("Future API call: block user", friend.userId)
        }
        title={t("label-block")}
        variant="danger"
      >
        <BlockIcon className="size-4 max-sm:size-[18px]" />
      </UserListItem.Action>
    </UserListItem>
  );
}
