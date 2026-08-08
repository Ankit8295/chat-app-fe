/**
 * Phase 2: Auth service no longer returns profile data.
 * Call /api/v1/users/me (cached by useUserQuery) to get name, image, etc.
 */
export type AuthResponse = {
  expiresInSeconds: number;
};

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
