import { Message } from "@/lib/queries/message/types";

export type WsEventType =
  | "ready"
  | "ping"
  | "pong"
  | "message_send"
  | "message_new"
  | "group_update"
  | "error";

export type WsEnvelope<T = unknown> = {
  type: WsEventType | string;
  payload: T;
};

export type WsReadyPayload = {
  userId: string;
};

export type WsErrorPayload = {
  code: string;
  message: string;
  conversationId?: string | null;
};

export type WsSendMessagePayload = {
  conversationId: string;
  content: string;
};

export type WsMessageNewPayload = Message;

export type WsGroupUpdatePayload = {
  id: string;
  type: "direct" | "group";
  name?: string | null;
  about?: string | null;
  image?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type WsConnectionStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closed"
  | "error";
