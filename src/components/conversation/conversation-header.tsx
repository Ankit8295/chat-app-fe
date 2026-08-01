"use client";

import Avatar from "@/components/ui/avatar/avatar";
import Typography from "@/components/ui/typography/typography";
import ArrowIcon from "@/icons/arrow";
import MoreIcon from "@/icons/more";
import SearchIcon from "@/icons/search";
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
        <button
          type="button"
          onClick={toggleSidebar}
          aria-label={t("label-open-menu")}
          title={t("label-open-menu")}
          className="flex size-10 shrink-0 items-center justify-center rounded-xl text-foreground/70 hover:bg-secondary hover:text-primary transition-colors cursor-pointer outline-none lg:hidden"
        >
          <ArrowIcon direction="left" className="size-5" />
        </button>

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
        <button
          type="button"
          aria-label={t("aria-search-chat")}
          title={t("aria-search-chat")}
          className="flex size-10 items-center justify-center rounded-xl text-foreground/70 hover:bg-secondary hover:text-primary transition-colors cursor-pointer outline-none"
        >
          <SearchIcon className="size-5" />
        </button>
        <button
          type="button"
          aria-label={t("aria-conversation-menu")}
          title={t("aria-conversation-menu")}
          className="flex size-10 items-center justify-center rounded-xl text-foreground/70 hover:bg-secondary hover:text-primary transition-colors cursor-pointer outline-none"
        >
          <MoreIcon className="size-5" />
        </button>
      </div>
    </header>
  );
}
