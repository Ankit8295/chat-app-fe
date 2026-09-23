"use client";

import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";
import SlidePanel from "@/components/ui/slide-panel";
import ProfileTab from "./profile-tab";

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
      <div className="min-h-0 flex-1 overflow-y-auto p-2.5">
        <ProfileTab />
      </div>
    </SlidePanel>
  );
}
