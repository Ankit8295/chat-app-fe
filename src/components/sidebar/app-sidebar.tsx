"use client";

import SidebarUserList from "./sidebar-user-list";
import SidebarHeader from "./sidebar-header";
import { useGetConversations } from "@/lib/queries/user/query";
import { useLayoutStore } from "@/store/store";
import SettingsIcon from "@/icons/settings";
import AddIcon from "@/icons/add";
import ThemeToggle from "@/components/ui/theme-toggle";
import Typography from "@/components/ui/typography/typography";
import Avatar from "@/components/ui/avatar/avatar";
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
      <SidebarHeader />

      <div className="flex-1 w-full min-h-0">
        <SidebarUserList
          conversations={conversations}
          isExpanded={isExpanded}
          isLoading={isLoading}
        />
      </div>

      <div
        className={cn(
          "w-full border-t border-border py-3 shrink-0 flex flex-col gap-2",
        )}
      >
        <button
          type="button"
          onClick={() => setAddFriendOpen(true)}
          className={cn(
            "group relative flex shrink-0 items-center justify-start gap-3 rounded-lg outline-none cursor-pointer",
            isAddFriendOpen && "bg-secondary",
            isExpanded ? "flex-1 px-2 " : "w-full px-2",
          )}
          title={t("label-add-friend")}
        >
          <Avatar
            icon={
              <AddIcon
                width={22}
                height={22}
                className={cn(
                  "stroke-current transition-colors duration-200",
                  isAddFriendOpen
                    ? "text-primary"
                    : "text-foreground group-hover:text-primary",
                )}
              />
            }
            isActive={isAddFriendOpen}
            shape="rounded"
            size="lg"
          />

          {isExpanded && (
            <Typography
              variant="span"
              className={cn(
                "min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-primary",
                isAddFriendOpen && "text-primary font-semibold",
              )}
            >
              {t("label-add-friend")}
            </Typography>
          )}
        </button>

        <div className="flex w-full items-center justify-between gap-1.5">
          <button
            type="button"
            onClick={() => setSettingsOpen(true)}
            className={cn(
              "group relative flex shrink-0 items-center justify-start gap-3 rounded-lg outline-none cursor-pointer",
              isExpanded ? "flex-1 px-2" : "w-full px-2",
              isSettingsOpen && "bg-secondary",
            )}
            title={t("label-settings")}
          >
            <Avatar
              icon={
                <SettingsIcon
                  width={22}
                  height={22}
                  className={cn(
                    "stroke-current transform-gpu transition-transform duration-300 group-hover:rotate-45",
                    isSettingsOpen
                      ? "text-primary"
                      : "text-foreground group-hover:text-primary",
                  )}
                />
              }
              isActive={isSettingsOpen}
              shape="rounded"
              size="lg"
            />

            {isExpanded && (
              <Typography
                variant="span"
                className={cn(
                  "min-w-0 flex-1 truncate text-left text-sm font-medium text-foreground transition-colors duration-200 group-hover:text-primary",
                  isSettingsOpen && "text-primary font-semibold",
                )}
              >
                {t("label-settings")}
              </Typography>
            )}
          </button>

          {isExpanded && <ThemeToggle />}
        </div>
      </div>
    </div>
  );
}
