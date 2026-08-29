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
      image?: string;
      participants: string[];
    };

export type UpdateGroupConversationRequest = {
  name?: string;
  about?: string;
};
