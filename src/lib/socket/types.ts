import { Message } from "@/lib/queries/message/types";

export type WsEventType =
  | "ready"
  | "ping"
  | "pong"
  | "error"
  | "message_send"
  | "message_new"
  | "message_update"
  | "message_updated"
  | "message_delete"
  | "message_deleted"
  | "member_add"
  | "member_added"
  | "member_remove"
  | "member_removed"
  | "group_update"
  | "group_updated";

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

export type WsConnectionStatus =
  | "idle"
  | "connecting"
  | "open"
  | "closed"
  | "error";
