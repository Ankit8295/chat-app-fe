"use client";

import SidebarUserList from "./sidebar-user-list";
import { useGetAllFriends } from "@/lib/queries/user/query";
type Props = {
  isExpanded: boolean;
};

export default function AppSidebar({ isExpanded }: Props) {
  const { data: friends = [], isLoading } = useGetAllFriends();

  return (
    <div className="flex h-full w-full flex-col items-start gap-2">
      <SidebarUserList
        users={friends}
        isExpanded={isExpanded}
        isLoading={isLoading}
      />
    </div>
  );
}
