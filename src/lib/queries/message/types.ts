export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderImage?: string | null;
  content: string;
  createdAt: string;
};

export type MessagePageResponse = {
  items: Message[];
  prevCursor: string | null;
  nextCursor: string | null;
};

export type GetMessagesParams = {
  nextCursor?: string;
  prevCursor?: string;
  limit?: number;
};
