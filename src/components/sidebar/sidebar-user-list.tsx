"use client";

import SidebarUserItem from "./sidebar-user-item";
import { useLayoutStore } from "@/store/store";
import { useParams, useRouter } from "next/navigation";
import { ROUTES } from "../../../routes.config";
import { useEffect, useRef } from "react";
import { Conversation } from "@/lib/queries/chat/types";
import { useTranslations } from "next-intl";
import {
  useGetUserPreferences,
  useSetUserPreferences,
} from "@/lib/queries/user/query";

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
  const activeConversatoinId = useLayoutStore(
    (state) => state.activeConversatoinId,
  );
  const setActiveConversationId = useLayoutStore(
    (state) => state.setActiveConversationId,
  );
  const { data: preferences } = useGetUserPreferences();
  const { mutate: setUserPreference } = useSetUserPreferences();
  const lastSentIdRef = useRef<string | null>(null);

  const toggleSidebar = useLayoutStore((state) => state.toggleSidebar);

  const onConversationClick = (conversation: Conversation) => {
    setActiveConversationId(conversation.id);
    if (
      typeof window !== "undefined" &&
      window.innerWidth < 1024 &&
      isExpanded
    ) {
      toggleSidebar();
    }
    router.push(ROUTES.CONVERSATION(conversation.id));
  };

  useEffect(() => {
    if (isLoading) return;

    const id = params?.id;
    if (id) {
      const isValid = conversations.some((conv) => conv.id === id);
      if (isValid) {
        setActiveConversationId(id);
        if (
          preferences &&
          preferences.lastConversationId !== id &&
          lastSentIdRef.current !== id
        ) {
          lastSentIdRef.current = id;
          setUserPreference(id);
        }
      } else {
        setActiveConversationId(null);
      }
    } else {
      setActiveConversationId(null);
    }
  }, [
    params?.id,
    preferences?.lastConversationId,
    conversations,
    isLoading,
    setActiveConversationId,
    setUserPreference,
  ]);

  return (
    <div className="flex w-full flex-1 flex-col items-center gap-2 overflow-y-auto pt-2">
      {isLoading
        ? Array.from({ length: 5 }).map((_, index) => (
            <SidebarUserItem key={index} isLoading isExpanded={isExpanded} />
          ))
        : conversations.map((conv) => (
            <SidebarUserItem
              key={conv.id}
              user={{
                id: conv.id,
                name: conv.name || t("label-conversation"),
                email: "",
                img: conv.image,
              }}
              isExpanded={isExpanded}
              isActive={conv.id === activeConversatoinId}
              onClick={() => onConversationClick(conv)}
            />
          ))}
    </div>
  );
}
