"use client";

import SidebarAddFriend from "./sidebar-add-friend";
import SidebarUserItem from "./sidebar-user-item";
import { useLayoutStore } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "../../../routes.config";
import { useEffect } from "react";
import { User } from "@/lib/queries/user/types";

type Props = {
  users: User[];
  isExpanded: boolean;
  isLoading?: boolean;
};

export default function SidebarUserList({
  users,
  isExpanded,
  isLoading = false,
}: Props) {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const activeUserId = useLayoutStore((state) => state.activeUserId);
  const setActiveUserId = useLayoutStore((state) => state.setActiveUserId);

  const onUserClick = (user: User) => {
    setActiveUserId(user.id);
    router.push(ROUTES.CHAT(user.id));
  };

  useEffect(() => {
    const userId = params?.id;
    if (userId) {
      setActiveUserId(userId);
    }
  }, []);

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-2 overflow-y-auto pt-2">
      <SidebarAddFriend isExpanded={isExpanded} />

      {!isLoading &&
        users.map((user) => (
          <SidebarUserItem
            key={user.id}
            user={user}
            isExpanded={isExpanded}
            isActive={user.id === activeUserId}
            onClick={() => onUserClick(user)}
          />
        ))}
    </div>
  );
}
