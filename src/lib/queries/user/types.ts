export type User = {
  id: string;
  email: string;
  name: string;
  img?: string;
};

export type UserSearchResult = {
  id: string;
  email: string;
  name: string;
  img?: string;
  friendshipStatus: "none" | "active" | "blocked";
};

export type Friend = {
  userId: string;
  name: string;
  email: string;
  profileImage?: string;
  friendshipStatus: "active" | "blocked";
  createdAt: string;
  updatedAt: string;
};

export type Conversation = {
  id: string;
  type: "direct" | "group";
  name?: string;
  image?: string;
  friendId?: string;
  createdAt: string;
  updatedAt: string;
};

export type CreateConversationRequest = {
  userId: string;
};
