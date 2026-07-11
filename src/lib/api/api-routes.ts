export const API_ROUTES = {
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    logout: "/api/v1/auth/logout",
  },
  users: {
    getAllUsers: "/api/v1/users",
    getUserById: (userId: string) => `/api/v1/users/${userId}`,
  },
} as const;

export type AuthApiRoute =
  (typeof API_ROUTES.auth)[keyof typeof API_ROUTES.auth];

export type UsersApiRoute =
  (typeof API_ROUTES.users)[keyof typeof API_ROUTES.users];
