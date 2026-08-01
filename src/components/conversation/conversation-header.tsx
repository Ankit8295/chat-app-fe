"use client";

import ActionIcon from "@/components/ui/action-icon";
import Avatar from "@/components/ui/avatar/avatar";
import Typography from "@/components/ui/typography/typography";
import { useLayoutStore } from "@/store/store";
import { useTranslations } from "next-intl";

type ConversationHeaderProps = {
  name: string;
  image?: string | null;
  isLoading?: boolean;
  onOpenInfo: () => void;
};

export default function ConversationHeader({
  name,
  image,
  isLoading = false,
  onOpenInfo,
}: ConversationHeaderProps) {
  const t = useTranslations();
  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  return (
    <header className="flex w-full shrink-0 items-center justify-between gap-2 border-b border-border bg-surface px-2 py-2.5 z-20 sm:px-3 sm:gap-3">
      <div className="flex min-w-0 flex-1 items-center gap-0.5">
        <ActionIcon
          name="arrow"
          direction="left"
          label={t("label-open-menu")}
          onClick={toggleSidebar}
          className="lg:hidden"
        />

        <button
          type="button"
          onClick={onOpenInfo}
          disabled={isLoading}
          aria-label={t("aria-open-conversation-info")}
          className="flex w-fit items-center gap-3 rounded-lg px-1 py-0.5 text-left transition-colors disabled:opacity-60 cursor-pointer disabled:cursor-default"
        >
          <Avatar
            name={name}
            src={image ?? undefined}
            size="md"
            shape="circle"
          />
          <Typography
            variant="span"
            className="block truncate text-base font-semibold text-foreground"
          >
            {name}
          </Typography>
        </button>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <ActionIcon name="search" label={t("aria-search-chat")} />
        <ActionIcon name="more" label={t("aria-conversation-menu")} />
      </div>
    </header>
  );
}
