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
    getMe: "/api/v1/users/me",
    getPreferences: "/api/v1/users/me/preferences",
    setPreferences: "/api/v1/users/me/preferences",
    getFriendById: (userId: string) => `/api/v1/users/${userId}`,
  },
  conversations: {
    getConversations: "/api/v1/conversations",
    getConversationById: (conversationId: string) =>
      `/api/v1/conversations/${conversationId}`,
    createConversation: "/api/v1/conversations",
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
