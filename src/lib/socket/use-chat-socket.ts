"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { getChatWsClient } from "./ws-client";
import { dispatchWsEnvelope } from "./envelope-handlers";
import {
  WsConnectionStatus,
  WsEnvelope,
  WsErrorPayload,
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
      dispatchWsEnvelope(envelope, { queryClient, setLastError });
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
