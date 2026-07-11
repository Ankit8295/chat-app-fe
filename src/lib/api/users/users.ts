import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import { normalizeApiError } from "@/lib/api/api-errors";

export type { ApiError } from "@/lib/api/api-errors";

export type User = {
  id: string;
  email: string;
  name: string;
  img?: string;
};

export async function getAllUsers() {
  try {
    const response = await axiosClient.get<User[]>(
      API_ROUTES.users.getAllUsers,
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error, "error-fetch-users-failed");
  }
}

export async function getUserById(userId: string) {
  try {
    const response = await axiosClient.get<User>(
      API_ROUTES.users.getUserById(userId),
    );

    return response.data;
  } catch (error) {
    throw normalizeApiError(error, "error-fetch-user-failed");
  }
}
