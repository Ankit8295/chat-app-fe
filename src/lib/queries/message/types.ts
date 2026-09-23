export type WireMessage = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderImage?: string | null;
  content?: string | null;
  ciphertext?: string | null;
  nonce?: string | null;
  keyVersion?: number | null;
  createdAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderImage?: string | null;
  content: string;
  decryptFailed?: boolean;
  createdAt: string;
};

export type WireMessagePageResponse = {
  items: WireMessage[];
  prevCursor: string | null;
  nextCursor: string | null;
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
