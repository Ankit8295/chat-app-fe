"use client";

import { useEffect, useMemo, useState } from "react";
import ConversationHeader from "@/components/conversation/conversation-header";
import ConversationInfo from "@/components/conversation/conversation-info";
import BlockedComposerBanner from "@/components/conversation/blocked-composer-banner";
import MessageList from "@/components/conversation/message-list";
import ConversationNotFound from "@/components/ui/conversation-not-found";
import MessageComposer from "@/components/ui/message-composer";
import MessageListSkeleton from "@/components/ui/message-list-skeleton";
import { useInfiniteMessages } from "@/lib/queries/message/query";
import { useConversationKey, useGetConversation } from "@/lib/queries/chat/query";
import { useGetMe, useUnblockFriend } from "@/lib/queries/user/query";
import { useChatSocketContext } from "@/lib/socket/chat-socket-provider";
import { conversationMemberIds } from "@/lib/crypto/conversation";
import { encryptPlaintext } from "@/lib/crypto/message";
import { MAX_PLAINTEXT_CHARS } from "@/lib/crypto/types";
import { useCrypto } from "@/lib/crypto/crypto-provider";
import { useParams } from "next/navigation";

export default function ConversationPage() {
  const params = useParams<{ id: string }>();
  const id = params?.id ?? "";
  const { data: conversation, isLoading, isError } = useGetConversation(id);
  const { data: me } = useGetMe();
  const { ready: cryptoReady } = useCrypto();
  const participantIds = useMemo(
    () => (conversation ? conversationMemberIds(conversation, me?.id) : []),
    [conversation, me?.id],
  );
  const conversationKey = useConversationKey(id, participantIds);
  const {
    messages,
    isLoading: isMessagesLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteMessages(id, participantIds);
  const { sendMessage, isConnected } = useChatSocketContext();
  const unblockFriend = useUnblockFriend();
  const [draft, setDraft] = useState("");
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    setIsInfoOpen(false);
    setDraft("");
  }, [id]);

  if (isError || (!isLoading && !conversation)) {
    return <ConversationNotFound />;
  }

  const toggleConvInfo = () => {
    setIsInfoOpen((prev) => !prev);
  };

  const displayName = conversation?.name ?? conversation?.id ?? "";
  const showMessageSkeleton = isLoading || !conversation || isMessagesLoading;
  const blockStatus = conversation?.blockStatus ?? "none";
  const isBlocked = blockStatus === "blocked_by_me" || blockStatus === "blocked_by_peer";
  const canSend =
    Boolean(id) &&
    isConnected &&
    cryptoReady &&
    conversationKey.isSuccess &&
    !isLoading &&
    !isSending &&
    !isBlocked;

  const handleSend = () => {
    const content = draft.trim();
    if (!content || !canSend) return;
    setIsSending(true);
    void encryptPlaintext(id, content)
      .then((encrypted) => {
        sendMessage({ conversationId: id, ...encrypted });
        setDraft("");
      })
      .finally(() => setIsSending(false));
  };

  const handleUnblock = () => {
    const peerId = conversation?.friend?.id;
    if (!peerId) return;
    unblockFriend.mutate(peerId);
  };

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
            {showMessageSkeleton ? (
              <MessageListSkeleton seed={id} />
            ) : (
              <MessageList
                messages={messages}
                currentUserId={me?.id}
                isGroup={conversation?.type === "group"}
                hasOlder={!!hasNextPage}
                isFetchingOlder={isFetchingNextPage}
                onLoadOlder={() => {
                  if (hasNextPage && !isFetchingNextPage) {
                    void fetchNextPage();
                  }
                }}
              />
            )}
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10">
            <div
              aria-hidden
              className="h-10 bg-linear-to-t from-background/80 via-background/40 to-transparent backdrop-blur-[2px]"
            />
            <div className="pointer-events-auto bg-background/55 max-md:p-2 backdrop-blur-xl p-4">
              {isBlocked && blockStatus !== "none" ? (
                <BlockedComposerBanner
                  variant={blockStatus}
                  onUnblock={
                    blockStatus === "blocked_by_me" ? handleUnblock : undefined
                  }
                  isUnblocking={unblockFriend.isPending}
                />
              ) : (
                <MessageComposer
                  value={draft}
                  onChange={setDraft}
                  disabled={!canSend}
                  maxLength={MAX_PLAINTEXT_CHARS}
                  onSend={handleSend}
                />
              )}
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
