export const API_ROUTES = {
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    logout: "/api/v1/auth/logout",
  },
  users: {
    searchUsers: "/api/v1/users",
    getFriends: "/api/v1/users/friends",
    getMe: "/api/v1/users/me",
    getFriendById: (userId: string) => `/api/v1/users/${userId}`,
  },
  conversations: {
    getConversations: "/api/v1/conversations",
    createConversation: "/api/v1/conversations",
  },
} as const;

export type AuthApiRoute =
  (typeof API_ROUTES.auth)[keyof typeof API_ROUTES.auth];

export type UsersApiRoute =
  (typeof API_ROUTES.users)[keyof typeof API_ROUTES.users];

export type ConversationsApiRoute =
  (typeof API_ROUTES.conversations)[keyof typeof API_ROUTES.conversations];
