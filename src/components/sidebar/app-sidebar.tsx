"use client";

import SidebarUserList from "./sidebar-user-list";
import { useGetAllUsers } from "@/hooks/queries/users";

type Props = {
  isExpanded: boolean;
};

export default function AppSidebar({ isExpanded }: Props) {
  const { data: friends = [], isLoading } = useGetAllUsers();

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
