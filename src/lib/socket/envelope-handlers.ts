import { InfiniteData, QueryClient } from "@tanstack/react-query";
import { ChatQueryKeys, MessagesQueryKeys } from "@/lib/queries/query-keys";
import { upsertMessageInCache } from "@/lib/queries/message/cache";
import { Message, MessagePageResponse } from "@/lib/queries/message/types";
import {
  Conversation,
  ConversationDetail,
} from "@/lib/queries/chat/types";
import {
  WsEnvelope,
  WsErrorPayload,
  WsGroupUpdatePayload,
  WsMessageNewPayload,
} from "./types";

type EnvelopeHandlerContext = {
  queryClient: QueryClient;
  setLastError: (error: WsErrorPayload | null) => void;
};

type EnvelopeHandler = (
  payload: unknown,
  context: EnvelopeHandlerContext,
) => void;

function handleMessageNew(
  payload: unknown,
  { queryClient }: EnvelopeHandlerContext,
) {
  const message = payload as WsMessageNewPayload;
  if (!message?.id || !message.conversationId) return;

  queryClient.setQueryData<InfiniteData<MessagePageResponse>>(
    [MessagesQueryKeys.MESSAGES, message.conversationId],
    (current) => upsertMessageInCache(current, message as Message),
  );
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
              name: updated.name,
              about: updated.about,
              image: updated.image,
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
            name: updated.name,
            about: updated.about,
            image: updated.image,
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
