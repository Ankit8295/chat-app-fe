export type Conversation = {
  id: string;
  type: "direct" | "group";
  name?: string | null;
  image?: string | null;
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ConversationParticipant = {
  id: string;
  name: string;
  image?: string | null;
  joinedAt: string;
};

export type ConversationDetail = {
  id: string;
  type: "direct" | "group";
  name?: string | null;
  image?: string | null;
  friend: ConversationParticipant | null;
  participants: ConversationParticipant[];
  createdBy?: string | null;
  createdAt: string;
  updatedAt: string;
};

export type CreateConversationRequest =
  | {
      type: "DIRECT";
      userId: string;
    }
  | {
      type: "GROUP";
      name: string;
      about?: string;
      image?: string | null;
      participants: string[];
    };
