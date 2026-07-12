import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import { User } from "./types";

export async function getAllFriends() {
  try {
    const response = await axiosClient.get<User[]>(
      API_ROUTES.users.getAllFriends,
    );

    return response.data;
  } catch (error) {
    console.error("error", error);
    throw new Error("something went wrong");
  }
}

export async function getFriendById(userId: string) {
  try {
    const response = await axiosClient.get<User>(
      API_ROUTES.users.getFriendById(userId),
    );

    return response.data;
  } catch (error) {
    console.error("error", error);
    throw new Error("something went wrong");
  }
}
