"use client";

import * as Tabs from "@radix-ui/react-tabs";
import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";
import Typography from "@/components/ui/typography/typography";
import SlidePanel from "@/components/ui/slide-panel";
import ProfileTab from "./profile-tab";
import FriendsTab from "./friends-tab";

export default function SettingsModal() {
  const t = useTranslations();
  const isSettingsOpen = useLayoutStore((state) => state.isSettingsOpen);
  const setSettingsOpen = useLayoutStore((state) => state.setSettingsOpen);

  return (
    <SlidePanel
      open={isSettingsOpen}
      onClose={() => setSettingsOpen(false)}
      title={t("label-settings")}
      size="lg"
    >
      <Tabs.Root
        defaultValue="profile"
        className="flex min-h-0 flex-1 flex-col gap-3 p-2.5 max-sm:gap-2"
      >
        <Tabs.List className="flex shrink-0 gap-1 border-b border-border pb-2">
          <Tabs.Trigger
            value="profile"
            className="flex flex-1 items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold text-foreground/70 hover:bg-secondary hover:text-foreground transition-all cursor-pointer outline-none data-[state=active]:bg-primary/20 data-[state=active]:text-primary border-b-3 border-transparent data-[state=active]:border-primary rounded-b-none"
          >
            <Typography variant="span">{t("label-profile")}</Typography>
          </Tabs.Trigger>
          <Tabs.Trigger
            value="friends"
            className="flex flex-1 items-center justify-center px-3 py-2 rounded-lg text-sm font-semibold text-foreground/70 hover:bg-secondary hover:text-foreground transition-all cursor-pointer outline-none data-[state=active]:bg-primary/20 data-[state=active]:text-primary border-b-3 border-transparent data-[state=active]:border-primary rounded-b-none"
          >
            <Typography variant="span">
              {t("label-manage-friends")}
            </Typography>
          </Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content
          value="profile"
          className="min-h-0 flex-1 overflow-y-auto focus:outline-none"
        >
          <ProfileTab />
        </Tabs.Content>

        <Tabs.Content
          value="friends"
          className="min-h-0 flex-1 overflow-y-auto focus:outline-none"
        >
          <FriendsTab />
        </Tabs.Content>
      </Tabs.Root>
    </SlidePanel>
  );
}
