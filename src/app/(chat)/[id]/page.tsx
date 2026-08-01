"use client";

import ConversationNotFound from "@/components/ui/conversation-not-found";
import MessageListSkeleton from "@/components/ui/message-list-skeleton";
import { useGetConversation } from "@/lib/queries/user/query";
import { useParams } from "next/navigation";

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: conversation, isLoading, isError } = useGetConversation(id);

  if (true) {
    return <MessageListSkeleton seed={id} />;
  }

  if (isError || !conversation) {
    return <ConversationNotFound />;
  }

  return <div>chat for {conversation.name ?? conversation.id}</div>;
}
