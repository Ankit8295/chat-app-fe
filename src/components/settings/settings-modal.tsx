"use client";

import React from "react";
import * as Dialog from "@radix-ui/react-dialog";
import * as Tabs from "@radix-ui/react-tabs";
import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";
import XIcon from "@/icons/x";
import ProfileTab from "./profile-tab";
import FriendsTab from "./friends-tab";

export default function SettingsModal() {
  const t = useTranslations();

  const isSettingsOpen = useLayoutStore((state) => state.isSettingsOpen);
  const setSettingsOpen = useLayoutStore((state) => state.setSettingsOpen);

  return (
    <Dialog.Root open={isSettingsOpen} onOpenChange={setSettingsOpen}>
      <Dialog.Portal>
        {/* Overlay */}
        <Dialog.Overlay className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs transition-opacity animate-fade-in" />

        {/* Content Box */}
        <Dialog.Content className="fixed inset-0 m-auto z-50 flex h-[550px] w-full max-w-2xl flex-col rounded-xl border border-border bg-surface-elevated p-6 shadow-2xl outline-none max-sm:h-full max-sm:w-full max-sm:max-h-full max-sm:max-w-none max-sm:m-0 max-sm:rounded-none max-sm:p-4 animate-scale-up">
          <div className="flex items-center justify-between border-b border-border pb-3 shrink-0">
            <div>
              <Dialog.Title className="text-xl font-bold text-foreground max-sm:text-lg">
                {t("label-settings") || "Settings"}
              </Dialog.Title>
              <Dialog.Description className="sr-only">
                Customize your profile settings and manage friends.
              </Dialog.Description>
            </div>
            <Dialog.Close asChild>
              <button
                type="button"
                className="rounded-full p-1.5 text-foreground/50 hover:bg-secondary hover:text-foreground transition-colors cursor-pointer outline-none"
                aria-label={t("label-close") || "Close"}
              >
                <XIcon className="size-5" />
              </button>
            </Dialog.Close>
          </div>

          {/* Radix Tabs setup */}
          <Tabs.Root
            defaultValue="profile"
            className="flex flex-1 gap-6 mt-4 min-h-0 max-sm:flex-col max-sm:gap-4 max-sm:mt-3"
          >
            {/* Left Hand Sidebar Navigation - Row on Mobile, Column on Desktop */}
            <Tabs.List className="flex flex-col gap-1 w-1/3 border-r border-border pr-4 shrink-0 max-sm:flex-row max-sm:w-full max-sm:border-r-0 max-sm:border-b max-sm:pb-2 max-sm:pr-0 max-sm:gap-2">
              <Tabs.Trigger
                value="profile"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left text-foreground/70 hover:bg-secondary hover:text-foreground transition-all cursor-pointer outline-none data-[state=active]:bg-primary/20 data-[state=active]:text-primary border-l-3 max-sm:border-l-0 max-sm:border-b-3 border-transparent data-[state=active]:border-primary max-sm:flex-1 max-sm:justify-center max-sm:py-2 max-sm:rounded-b-none"
              >
                <span>{t("label-profile") || "Profile"}</span>
              </Tabs.Trigger>

              <Tabs.Trigger
                value="friends"
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-semibold text-left text-foreground/70 hover:bg-secondary hover:text-foreground transition-all cursor-pointer outline-none data-[state=active]:bg-primary/20 data-[state=active]:text-primary border-l-3 max-sm:border-l-0 max-sm:border-b-3 border-transparent data-[state=active]:border-primary max-sm:flex-1 max-sm:justify-center max-sm:py-2 max-sm:rounded-b-none"
              >
                <span>{t("label-manage-friends") || "Manage Friends"}</span>
              </Tabs.Trigger>
            </Tabs.List>

            {/* Right Hand Panels */}
            {/* PROFILE TAB */}
            <Tabs.Content
              value="profile"
              className="flex-1 overflow-y-auto pl-2 focus:outline-none flex flex-col items-center justify-center py-6 gap-6 max-sm:pl-0 max-sm:py-2 max-sm:justify-start"
            >
              <ProfileTab />
            </Tabs.Content>

            {/* MANAGE FRIENDS TAB */}
            <Tabs.Content
              value="friends"
              className="flex-1 overflow-y-auto pl-2 focus:outline-none flex flex-col gap-6 max-sm:pl-0 max-sm:gap-4"
            >
              <FriendsTab />
            </Tabs.Content>
          </Tabs.Root>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
