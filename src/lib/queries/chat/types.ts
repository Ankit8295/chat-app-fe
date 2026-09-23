export type Conversation = {
  id: string;
  type: "direct" | "group";
  name?: string;
  about?: string;
  image?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
};

export type ConversationParticipant = {
  id: string;
  name: string;
  image?: string;
  joinedAt: string;
};

export type ConversationDetail = {
  id: string;
  type: "direct" | "group";
  name?: string;
  about?: string;
  image?: string;
  friend: ConversationParticipant | null;
  participants: ConversationParticipant[];
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  blockStatus?: "none" | "blocked_by_me" | "blocked_by_peer";
};

export type KeyEnvelope = {
  userId: string;
  wrappedKey: string;
  wrapNonce: string;
  ephPublicKey: string;
};

export type ConversationKeyEnvelope = KeyEnvelope & {
  keyVersion: number;
};

export type ConversationKeysResponse = {
  envelopes: ConversationKeyEnvelope[];
};

export type PutConversationKeysRequest = {
  keyVersion: number;
  envelopes: KeyEnvelope[];
};

export type CreateConversationRequest =
  | {
      type: "DIRECT";
      userId: string;
      keyVersion?: number;
      envelopes?: KeyEnvelope[];
    }
  | {
      type: "GROUP";
      name: string;
      about?: string;
      image?: string;
      participants: string[];
      keyVersion?: number;
      envelopes?: KeyEnvelope[];
    };

export type UpdateGroupConversationRequest = {
  name?: string;
  about?: string;
};
