import { API_ROUTES } from "@/lib/api/api-routes";
import { clientApiClient } from "@/lib/api/client-api-client";
import { isAxiosError } from "axios";

export type AuthResponse = {
  expiresInSeconds: number;
  user: {
    id: string;
    email: string;
    name: string;
  };
};

export type ApiFormError = {
  message: string;
  fieldErrors?: Record<string, string[]>;
};

type BackendApiError = {
  message?: string;
  fieldErrors?: Record<string, string>;
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
    const response = await clientApiClient.post<AuthResponse>(
      API_ROUTES.auth.register,
      {
        name: payload.name,
        email: payload.email,
        password: payload.password,
      },
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

export async function login(payload: LoginPayload) {
  try {
    const response = await clientApiClient.post<AuthResponse>(
      API_ROUTES.auth.login,
      payload,
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error);
  }
}

function normalizeApiError(error: unknown): ApiFormError {
  if (!isAxiosError<BackendApiError>(error)) {
    return {
      message: "error-backend-unavailable",
    };
  }

  const apiError = error.response?.data;

  return {
    message: apiError?.message ?? "error-authentication-failed",
    fieldErrors: mapBackendFieldErrors(apiError?.fieldErrors),
  };
}

function mapBackendFieldErrors(fieldErrors?: Record<string, string>) {
  if (!fieldErrors) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(fieldErrors).map(([field, message]) => [
      field,
      [message],
    ]),
  );
}
