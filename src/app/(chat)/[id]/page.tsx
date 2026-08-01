"use client";

import { useEffect, useState } from "react";
import ConversationHeader from "@/components/conversation/conversation-header";
import ConversationInfo from "@/components/conversation/conversation-info";
import ConversationNotFound from "@/components/ui/conversation-not-found";
import MessageComposer from "@/components/ui/message-composer";
import MessageListSkeleton from "@/components/ui/message-list-skeleton";
import { useGetConversation } from "@/lib/queries/user/query";
import { useParams } from "next/navigation";

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: conversation, isLoading, isError } = useGetConversation(id);
  const [draft, setDraft] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);

  useEffect(() => {
    setIsInfoOpen(false);
  }, [id]);

  if (isError || (!isLoading && !conversation)) {
    return <ConversationNotFound />;
  }

  const toggleConvInfo = () => {
    setIsInfoOpen((prev) => !prev);
  };

  const displayName = conversation?.name ?? conversation?.id ?? "";

  return (
    <div className="relative flex h-full min-h-0 w-full overflow-hidden">
      <div className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden">
        <ConversationHeader
          name={displayName}
          image={conversation?.image}
          isLoading={isLoading || !conversation}
          onOpenInfo={toggleConvInfo}
        />

        <div className="relative min-h-0 flex-1 overflow-hidden">
          <div className="absolute inset-0 min-h-0">
            {isLoading || !conversation ? (
              <MessageListSkeleton seed={id} />
            ) : (
              <div className="h-full min-h-0 overflow-y-auto px-2 pb-28" />
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div
              aria-hidden
              className="h-10 bg-linear-to-t from-background/80 via-background/40 to-transparent backdrop-blur-[2px]"
            />
            <div className="pointer-events-auto bg-background/55 max-md:p-2 backdrop-blur-xl p-4">
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
      </div>

      {conversation && (
        <ConversationInfo
          conversation={conversation}
          open={isInfoOpen}
          onClose={() => setIsInfoOpen(false)}
        />
      )}
    </div>
  );
}
