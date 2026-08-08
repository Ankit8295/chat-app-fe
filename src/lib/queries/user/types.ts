export type User = {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  img?: string;
  about?: string;
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

export type UserPreference = {
  userId: string;
  lastConversationId: string | null;
};

export type CreateUserPreferenceRequest = {
  lastConversationId: string | null;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasMore: boolean;
};
