import {
  WsConnectionStatus,
  WsEnvelope,
  WsEventType,
  WsSendMessagePayload,
} from "./types";

type EventHandler = (envelope: WsEnvelope) => void;

const DEFAULT_API_BASE_URL = "http://localhost:8080";
const HEARTBEAT_INTERVAL_MS = 25_000;
const MIN_RECONNECT_DELAY_MS = 1_000;
const MAX_RECONNECT_DELAY_MS = 30_000;

function toWebSocketUrl(apiBaseUrl: string): string {
  const url = new URL(apiBaseUrl);
  url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
  url.pathname = "/ws";
  url.search = "";
  url.hash = "";
  return url.toString();
}

export class ChatWsClient {
  private socket: WebSocket | null = null;
  private status: WsConnectionStatus = "idle";
  private readonly handlers = new Set<EventHandler>();
  private readonly statusHandlers = new Set<
    (status: WsConnectionStatus) => void
  >();
  private heartbeatTimer: ReturnType<typeof setInterval> | null = null;
  private reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  private reconnectAttempt = 0;
  private shouldReconnect = false;
  private readonly url: string;

  constructor(
    apiBaseUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL ??
      DEFAULT_API_BASE_URL,
  ) {
    this.url = toWebSocketUrl(apiBaseUrl);
  }

  connect() {
    if (
      this.socket?.readyState === WebSocket.OPEN ||
      this.socket?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    this.shouldReconnect = true;
    this.setStatus("connecting");

    const socket = new WebSocket(this.url);
    this.socket = socket;

    socket.onopen = () => {
      this.reconnectAttempt = 0;
      this.setStatus("open");
      this.startHeartbeat();
    };

    socket.onmessage = (event) => {
      try {
        const envelope = JSON.parse(String(event.data)) as WsEnvelope;
        if (!envelope?.type) return;
        this.handlers.forEach((handler) => handler(envelope));
      } catch (error) {
        console.error("Failed to parse WebSocket message", error);
      }
    };

    socket.onerror = () => {
      this.setStatus("error");
    };

    socket.onclose = () => {
      this.stopHeartbeat();
      this.socket = null;
      this.setStatus("closed");
      if (this.shouldReconnect) {
        this.scheduleReconnect();
      }
    };
  }

  disconnect() {
    this.shouldReconnect = false;
    this.clearReconnectTimer();
    this.stopHeartbeat();
    this.socket?.close();
    this.socket = null;
    this.setStatus("closed");
  }

  send(type: WsEventType | string, payload: unknown = {}) {
    if (!this.socket || this.socket.readyState !== WebSocket.OPEN) {
      throw new Error("WebSocket is not connected");
    }
    const envelope: WsEnvelope = { type, payload };
    this.socket.send(JSON.stringify(envelope));
  }

  sendMessage(payload: WsSendMessagePayload) {
    this.send("message_send", payload);
  }

  ping() {
    this.send("ping", {});
  }

  subscribe(handler: EventHandler) {
    this.handlers.add(handler);
    return () => {
      this.handlers.delete(handler);
    };
  }

  onStatusChange(handler: (status: WsConnectionStatus) => void) {
    this.statusHandlers.add(handler);
    handler(this.status);
    return () => {
      this.statusHandlers.delete(handler);
    };
  }

  getStatus() {
    return this.status;
  }

  private setStatus(status: WsConnectionStatus) {
    this.status = status;
    this.statusHandlers.forEach((handler) => handler(status));
  }

  private startHeartbeat() {
    this.stopHeartbeat();
    this.heartbeatTimer = setInterval(() => {
      if (this.socket?.readyState === WebSocket.OPEN) {
        this.ping();
      }
    }, HEARTBEAT_INTERVAL_MS);
  }

  private stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  private scheduleReconnect() {
    this.clearReconnectTimer();
    const delay = Math.min(
      MIN_RECONNECT_DELAY_MS * 2 ** this.reconnectAttempt,
      MAX_RECONNECT_DELAY_MS,
    );
    this.reconnectAttempt += 1;
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  private clearReconnectTimer() {
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
  }
}

let singleton: ChatWsClient | null = null;

export function getChatWsClient() {
  if (!singleton) {
    singleton = new ChatWsClient();
  }
  return singleton;
}
