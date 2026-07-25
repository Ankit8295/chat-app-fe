"use client";

import SidebarUserList from "./sidebar-user-list";
import AddFriendModal from "./add-friend-modal";
import { useGetConversations } from "@/lib/queries/user/query";
import { useLayoutStore } from "@/store/store";
import SettingsIcon from "@/icons/settings";
import AddIcon from "@/icons/add";
import ThemeToggle from "@/components/ui/theme-toggle";
import { useTranslations } from "next-intl";
import { cn } from "../../../cn.config";

type Props = {
  isExpanded: boolean;
};

export default function AppSidebar({ isExpanded }: Props) {
  const t = useTranslations();
  const { data: conversations = [], isLoading } = useGetConversations();

  const isSettingsOpen = useLayoutStore((state) => state.isSettingsOpen);
  const setSettingsOpen = useLayoutStore((state) => state.setSettingsOpen);

  const isAddFriendOpen = useLayoutStore((state) => state.isAddFriendOpen);
  const setAddFriendOpen = useLayoutStore((state) => state.setAddFriendOpen);

  return (
    <div className="flex h-full w-full flex-col items-start justify-between gap-2">
      {/* Conversations List */}
      <div className="flex-1 w-full min-h-0">
        <SidebarUserList
          conversations={conversations}
          isExpanded={isExpanded}
          isLoading={isLoading}
        />
      </div>

      {/* Sidebar Footer with Add Friend, Settings, and Theme Toggle */}
      <div
        className={cn(
          "w-full border-t border-border py-3 shrink-0 flex flex-col gap-2",
          isExpanded ? "px-2" : "px-0"
        )}
      >
        {/* Add Friend Button */}
        <button
          type="button"
          onClick={() => setAddFriendOpen(true)}
          className={cn(
            "group relative flex shrink-0 items-center justify-start gap-3 rounded-lg rounded-tl-none rounded-bl-none outline-none cursor-pointer",
            isExpanded ? "w-full px-2 py-1" : "w-full px-2",
            isAddFriendOpen && "bg-secondary"
          )}
          title={t("label-add-friend") || "Add Friend"}
        >
          <span
            aria-hidden
            className={cn(
              "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-primary transition-all duration-200",
              isAddFriendOpen
                ? "h-full opacity-100"
                : "h-0 opacity-0 group-hover:h-[50%] group-hover:opacity-100"
            )}
          />

          <span className="relative shrink-0">
            <span
              className={cn(
                "flex size-12 items-center justify-center rounded-full bg-secondary text-foreground transition-colors duration-200",
                isAddFriendOpen ? "text-primary" : "group-hover:text-primary"
              )}
            >
              <AddIcon
                width={22}
                height={22}
                className={cn(
                  "stroke-current transition-transform duration-300 group-hover:scale-110",
                  isAddFriendOpen ? "text-primary" : "text-foreground"
                )}
              />
            </span>
          </span>

          {isExpanded && (
            <span
              className={cn(
                "min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-primary",
                isAddFriendOpen && "text-primary"
              )}
            >
              {t("label-add-friend") || "Add Friend"}
            </span>
          )}
        </button>

        {/* Settings Button & Theme Toggle */}
        <div className="flex w-full items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className={cn(
              "group relative flex shrink-0 items-center justify-start gap-3 rounded-lg rounded-tl-none rounded-bl-none outline-none cursor-pointer",
              isExpanded ? "flex-1 px-2 py-1" : "w-full px-2",
              isSettingsOpen && "bg-secondary"
            )}
            title={t("label-settings") || "Settings"}
          >
            <span
              aria-hidden
              className={cn(
                "absolute left-0 top-1/2 -translate-y-1/2 w-1 rounded-r-full bg-primary transition-all duration-200",
                isSettingsOpen
                  ? "h-full opacity-100"
                  : "h-0 opacity-0 group-hover:h-[50%] group-hover:opacity-100"
              )}
            />

            <span className="relative shrink-0">
              <span
                className={cn(
                  "flex size-12 items-center justify-center rounded-full bg-secondary text-foreground transition-colors duration-200",
                  isSettingsOpen ? "text-primary" : "group-hover:text-primary"
                )}
              >
                <SettingsIcon
                  width={22}
                  height={22}
                  className={cn(
                    "stroke-current transition-all duration-300 group-hover:rotate-45",
                    isSettingsOpen ? "text-primary" : "text-foreground"
                  )}
                />
              </span>
            </span>

            {isExpanded && (
              <span
                className={cn(
                  "min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-primary",
                  isSettingsOpen && "text-primary"
                )}
              >
                {t("label-settings") || "Settings"}
              </span>
            )}
          </button>

          {isExpanded && <ThemeToggle />}
        </div>
      </div>

      {/* Add Friend Dialog Modal */}
      <AddFriendModal />
    </div>
  );
}
