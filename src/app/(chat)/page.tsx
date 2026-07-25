"use client";

import Typography from "@/components/ui/typography/typography";
import MessageIcon from "@/icons/message-icon";
import { useTranslations } from "next-intl";

export default function ChatLandingPage() {
  const t = useTranslations();

  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-6 text-center">
      <div className="flex size-20 items-center justify-center rounded-full bg-secondary text-primary">
        <MessageIcon className="size-10 stroke-current" />
      </div>
      <div className="max-w-md space-y-1.5">
        <Typography variant="h2" className="text-xl font-bold text-foreground">
          {t("label-no-conversation-selected")}
        </Typography>
        <Typography variant="p" className="text-sm text-muted">
          {t("description-no-conversation-selected")}
        </Typography>
      </div>
    </div>
  );
}
