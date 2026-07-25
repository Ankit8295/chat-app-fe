"use client";

import SidebarUserItem from "./sidebar-user-item";
import { useLayoutStore } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "../../../routes.config";
import { useEffect } from "react";
import { Conversation } from "@/lib/queries/user/types";
import { useTranslations } from "next-intl";

type Props = {
  conversations: Conversation[];
  isExpanded: boolean;
  isLoading?: boolean;
};

export default function SidebarUserList({
  conversations,
  isExpanded,
  isLoading = false,
}: Props) {
  const t = useTranslations();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const activeUserId = useLayoutStore((state) => state.activeUserId);
  const setActiveUserId = useLayoutStore((state) => state.setActiveUserId);

  const onConversationClick = (conversation: Conversation) => {
    setActiveUserId(conversation.id);
    router.push(ROUTES.CHAT(conversation.id));
  };

  useEffect(() => {
    const id = params?.id;
    if (id) {
      setActiveUserId(id);
    }
  }, [params?.id, setActiveUserId]);

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-2 overflow-y-auto pt-2">
      {!isLoading &&
        conversations.map((conv) => (
          <SidebarUserItem
            key={conv.id}
            user={{
              id: conv.id,
              name: conv.name || t("label-conversation"),
              email: "",
              img: conv.image,
            }}
            isExpanded={isExpanded}
            isActive={conv.id === activeUserId}
            onClick={() => onConversationClick(conv)}
          />
        ))}
    </div>
  );
}
