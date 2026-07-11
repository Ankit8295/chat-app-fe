"use client";

import AddIcon from "@/icons/add";
import { cn } from "../../../cn.config";

type Props = {
  isExpanded?: boolean;
};

export default function SidebarAddFriend({ isExpanded = false }: Props) {
  const onAddFriendClick = () => {
    console.log("open popup for adding friends");
  };

  return (
    <button
      type="button"
      title="Add friend"
      onClick={onAddFriendClick}
      className={cn(
        "group relative flex w-full px-2 shrink-0 items-center justify-start gap-3 rounded-lg rounded-tl-none rounded-bl-none outline-none cursor-pointer",
      )}
    >
      <span className="relative shrink-0">
        <span
          className={cn(
            "flex size-12 items-center rounded-full justify-center overflow-hidden bg-secondary text-sm font-semibold text-foreground transition-[border-radius] duration-200 ",
          )}
        >
          <AddIcon
            width={22}
            height={22}
            className="stroke-current transition-colors group-hover:text-primary"
          />
        </span>
      </span>

      {isExpanded && (
        <span className="min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground">
          Add friend
        </span>
      )}
    </button>
  );
}
