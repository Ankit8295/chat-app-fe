"use client";

import InfoBox from "@/components/ui/info-box";
import MessageIcon from "@/icons/message-icon";
import { useTranslations } from "next-intl";

export default function ConversationNotFound() {
  const t = useTranslations();

  return (
    <InfoBox
      icon={<MessageIcon className="size-10 stroke-current" />}
      title={t("label-conversation-not-found")}
      description={t("description-conversation-not-found")}
    />
  );
}
