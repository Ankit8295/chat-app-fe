"use client";

import { Friend } from "@/lib/queries/user/types";
import { useTranslations } from "next-intl";
import { UserListItem } from "@/components/ui/user-list-item";

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
        name="trash"
        label={t("label-remove")}
        variant="danger"
        onClick={() =>
          console.log("Future API call: remove friend", friend.userId)
        }
      />
      <UserListItem.Action
        name="block"
        label={t("label-block")}
        variant="danger"
        onClick={() =>
          console.log("Future API call: block user", friend.userId)
        }
      />
    </UserListItem>
  );
}
