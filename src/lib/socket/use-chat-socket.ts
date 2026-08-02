"use client";

import { useEffect, useState } from "react";
import { InfiniteData, useQueryClient } from "@tanstack/react-query";
import { MessagesQueryKeys } from "@/lib/queries/query-keys";
import { upsertMessageInCache } from "@/lib/queries/message/cache";
import { Message, MessagePageResponse } from "@/lib/queries/message/types";
import { getChatWsClient } from "./ws-client";
import {
  WsConnectionStatus,
  WsEnvelope,
  WsErrorPayload,
  WsMessageNewPayload,
  WsSendMessagePayload,
} from "./types";

export function useChatSocket() {
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<WsConnectionStatus>("idle");
  const [lastError, setLastError] = useState<WsErrorPayload | null>(null);

  useEffect(() => {
    const client = getChatWsClient();
    client.connect();

    const unsubscribeStatus = client.onStatusChange(setStatus);
    const unsubscribeEvents = client.subscribe((envelope: WsEnvelope) => {
      if (envelope.type === "message_new") {
        const message = envelope.payload as WsMessageNewPayload;
        if (!message?.id || !message.conversationId) return;

        queryClient.setQueryData<InfiniteData<MessagePageResponse>>(
          [MessagesQueryKeys.MESSAGES, message.conversationId],
          (current) => upsertMessageInCache(current, message as Message),
        );
        return;
      }

      if (envelope.type === "error") {
        setLastError(envelope.payload as WsErrorPayload);
      }
    });

    return () => {
      unsubscribeStatus();
      unsubscribeEvents();
      client.disconnect();
    };
  }, [queryClient]);

  const sendMessage = (payload: WsSendMessagePayload) => {
    getChatWsClient().sendMessage(payload);
  };

  return {
    status,
    lastError,
    sendMessage,
    isConnected: status === "open",
  };
}
