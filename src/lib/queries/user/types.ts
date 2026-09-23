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

export type UpdateUserProfileRequest = {
  name?: string;
  about?: string;
};

export type AvatarPresignRequest = {
  contentType: string;
  fileName: string;
  sizeBytes: number;
};

export type ProfilePresignedUrlResponse = {
  mediaId: string;
  objectKey: string;
  uploadUrl: string;
  method: string;
  expiresIn: number;
  headers: Record<string, string>;
};

export type AvatarConfirmRequest = {
  mediaId: string;
};

export type OwnIdentityKey = {
  userId: string;
  publicKey: string;
  wrappedPrivateKey: string;
  wrapNonce: string;
  kdfSalt: string;
  kdfIterations: number;
  algorithm: string;
};

export type PublicIdentityKey = {
  userId: string;
  publicKey: string;
};

export type UpsertIdentityKeyRequest = {
  publicKey: string;
  wrappedPrivateKey: string;
  wrapNonce: string;
  kdfSalt: string;
  kdfIterations: number;
  algorithm: string;
};

export type PageResponse<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  hasMore: boolean;
};
