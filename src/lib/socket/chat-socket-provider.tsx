"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useChatSocket } from "./use-chat-socket";
import { WsConnectionStatus, WsErrorPayload, WsSendMessagePayload } from "./types";

type ChatSocketContextValue = {
  status: WsConnectionStatus;
  lastError: WsErrorPayload | null;
  sendMessage: (payload: WsSendMessagePayload) => void;
  isConnected: boolean;
};

const ChatSocketContext = createContext<ChatSocketContextValue | null>(null);

export function ChatSocketProvider({ children }: { children: ReactNode }) {
  const socket = useChatSocket();

  return (
    <ChatSocketContext.Provider value={socket}>{children}</ChatSocketContext.Provider>
  );
}

export function useChatSocketContext() {
  const context = useContext(ChatSocketContext);
  if (!context) {
    throw new Error("useChatSocketContext must be used within ChatSocketProvider");
  }
  return context;
}
