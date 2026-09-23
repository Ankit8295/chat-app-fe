import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { ChatQueryKeys, MessagesQueryKeys } from "@/lib/queries/query-keys";
import { upsertMessageInCache } from "@/lib/queries/message/cache";
import { Message, MessagePageResponse, WireMessage } from "@/lib/queries/message/types";
import { Conversation, ConversationDetail } from "@/lib/queries/chat/types";
import { decryptWireMessage } from "@/lib/crypto/message";
import {
  WsEnvelope,
  WsErrorPayload,
  WsGroupUpdatePayload,
} from "./types";

type EnvelopeHandlerContext = {
  queryClient: QueryClient;
  setLastError: (error: WsErrorPayload) => void;
};

type EnvelopeHandler = (
  payload: unknown,
  context: EnvelopeHandlerContext,
) => void;

function handleMessageNew(
  payload: unknown,
  { queryClient }: EnvelopeHandlerContext,
) {
  const message = payload as WireMessage;
  if (!message?.id || !message.conversationId) return;

  void decryptWireMessage(message).then((decrypted: Message) => {
    queryClient.setQueryData<InfiniteData<MessagePageResponse>>(
      [MessagesQueryKeys.MESSAGES, message.conversationId],
      (current) => upsertMessageInCache(current, decrypted),
    );
  });
}

function handleGroupUpdate(
  payload: unknown,
  { queryClient }: EnvelopeHandlerContext,
) {
  const updated = payload as WsGroupUpdatePayload;
  if (!updated?.id) return;

  queryClient.setQueryData<Conversation[]>(
    [ChatQueryKeys.CONVERSATIONS],
    (existing) =>
      existing?.map((conversation) =>
        conversation.id === updated.id
          ? {
              ...conversation,
              name: updated.name ?? undefined,
              about: updated.about ?? undefined,
              image: updated.image ?? undefined,
              updatedAt: updated.updatedAt,
            }
          : conversation,
      ),
  );

  queryClient.setQueryData<ConversationDetail>(
    [ChatQueryKeys.CONVERSATION, updated.id],
    (existing) =>
      existing
        ? {
            ...existing,
            name: updated.name ?? undefined,
            about: updated.about ?? undefined,
            image: updated.image ?? undefined,
            updatedAt: updated.updatedAt,
          }
        : existing,
  );
}

function handleError(
  payload: unknown,
  { setLastError }: EnvelopeHandlerContext,
) {
  setLastError(payload as WsErrorPayload);
}

const envelopeHandlers: Record<string, EnvelopeHandler> = {
  message_new: handleMessageNew,
  group_update: handleGroupUpdate,
  error: handleError,
};

export function dispatchWsEnvelope(
  envelope: WsEnvelope,
  context: EnvelopeHandlerContext,
) {
  const handler = envelopeHandlers[envelope.type];
  handler?.(envelope.payload, context);
}
