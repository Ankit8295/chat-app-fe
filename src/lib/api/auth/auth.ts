import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import { normalizeApiFormError } from "@/lib/api/api-errors";

export type { ApiFormError } from "@/lib/api/api-errors";

export type AuthResponse = {
  expiresInSeconds: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
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

export async function register(payload: RegisterPayload) {
  try {
    const response = await axiosClient.post<AuthResponse>(
      API_ROUTES.auth.register,
      {
        name: payload.name,
        email: payload.email,
        password: payload.password,
      },
    );

    return response.data;
  } catch (error) {
    throw normalizeApiFormError(error, "error-authentication-failed");
  }
}

export async function login(payload: LoginPayload) {
  try {
    const response = await axiosClient.post<AuthResponse>(
      API_ROUTES.auth.login,
      payload,
    );

    return response.data;
  } catch (error) {
    throw normalizeApiFormError(error, "error-authentication-failed");
  }
}
