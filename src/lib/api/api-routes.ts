export const API_ROUTES = {
  auth: {
    register: "/api/v1/auth/register",
    login: "/api/v1/auth/login",
    logout: "/api/v1/auth/logout",
  },
} as const;

export type AuthApiRoute = (typeof API_ROUTES.auth)[keyof typeof API_ROUTES.auth];
