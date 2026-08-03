import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import { AuthResponse, LoginPayload, RegisterPayload } from "./types";

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
    console.error("error", error);
    throw new Error("something went wrong");
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
    console.error("error", error);
    throw new Error("something went wrong");
  }
}

export async function logout() {
  await axiosClient.post(API_ROUTES.auth.logout);
}

export async function refreshSession() {
  const response = await axiosClient.post<AuthResponse>(
    API_ROUTES.auth.refresh,
  );
  return response.data;
}
