"use client";

import { useState } from "react";
import ConversationNotFound from "@/components/ui/conversation-not-found";
import MessageComposer from "@/components/ui/message-composer";
import MessageListSkeleton from "@/components/ui/message-list-skeleton";
import Typography from "@/components/ui/typography/typography";
import { useGetConversation } from "@/lib/queries/user/query";
import { useParams } from "next/navigation";

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: conversation, isLoading, isError } = useGetConversation(id);
  const [draft, setDraft] = useState("");

  if (isError || (!isLoading && !conversation)) {
    return <ConversationNotFound />;
  }

  return (
    <div className="relative h-full min-h-0 w-full overflow-hidden">
      <div className="absolute inset-0 min-h-0">
        {true ? (
          <MessageListSkeleton seed={id} />
        ) : (
          <div className="h-full min-h-0 overflow-y-auto px-2 pb-28">
            <Typography variant="p" className="text-muted p-4">
              {conversation.name ?? conversation.id}
            </Typography>
          </div>
        )}
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
        <div
          aria-hidden
          className="h-10 bg-linear-to-t from-background/80 via-background/40 to-transparent backdrop-blur-[2px]"
        />
        <div className="pointer-events-auto  bg-background/55 max-md:p-2 backdrop-blur-xl p-4">
          <MessageComposer
            value={draft}
            onChange={setDraft}
            disabled={isLoading}
            onSend={() => {
              if (!draft.trim()) return;
              setDraft("");
            }}
          />
        </div>
      </div>
    </div>
  );
}
