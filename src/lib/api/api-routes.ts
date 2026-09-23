export const API_ROUTES = {
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    logout: "/api/v1/auth/logout",
    refresh: "/api/v1/auth/refresh",
  },
  users: {
    searchUsers: "/api/v1/users",
    getFriends: "/api/v1/users/friends",
    removeFriend: (userId: string) => `/api/v1/users/friends/${userId}`,
    blockFriend: (userId: string) => `/api/v1/users/friends/${userId}/block`,
    unblockFriend: (userId: string) => `/api/v1/users/friends/${userId}/block`,
    getMe: "/api/v1/users/me",
    updateMe: "/api/v1/users/me",
    presignAvatar: "/api/v1/users/me/avatar/presign",
    confirmAvatar: "/api/v1/users/me/avatar/confirm",
    removeAvatar: "/api/v1/users/me/avatar",
    getPreferences: "/api/v1/users/me/preferences",
    setPreferences: "/api/v1/users/me/preferences",
    getMyCrypto: "/api/v1/users/me/crypto",
    putMyCrypto: "/api/v1/users/me/crypto",
    getPublicCrypto: "/api/v1/users/crypto",
    getFriendById: (userId: string) => `/api/v1/users/${userId}`,
  },
  conversations: {
    getConversations: "/api/v1/conversations",
    getConversationById: (conversationId: string) =>
      `/api/v1/conversations/${conversationId}`,
    createConversation: "/api/v1/conversations",
    updateConversation: (conversationId: string) =>
      `/api/v1/conversations/${conversationId}`,
    deleteConversation: (conversationId: string) =>
      `/api/v1/conversations/${conversationId}`,
    getConversationKeys: (conversationId: string) =>
      `/api/v1/conversations/${conversationId}/keys`,
    putConversationKeys: (conversationId: string) =>
      `/api/v1/conversations/${conversationId}/keys`,
    getMessages: (conversationId: string) =>
      `/api/v1/conversations/${conversationId}/messages`,
  },
} as const;

export type AuthApiRoute =
  (typeof API_ROUTES.auth)[keyof typeof API_ROUTES.auth];

export type UsersApiRoute =
  (typeof API_ROUTES.users)[keyof typeof API_ROUTES.users];

export type ConversationsApiRoute =
  (typeof API_ROUTES.conversations)[keyof typeof API_ROUTES.conversations];
