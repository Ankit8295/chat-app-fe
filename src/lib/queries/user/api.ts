import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import { User, UserSearchResult, Friend, Conversation } from "./types";

export async function searchUsers(search?: string) {
  try {
    const response = await axiosClient.get<UserSearchResult[]>(
      API_ROUTES.users.searchUsers,
      {
        params: search ? { search } : undefined,
      }
    );
    return response.data;
  } catch (error) {
    console.error("error searching users", error);
    throw new Error("Failed to search users");
  }
}

export async function getFriendsOnly() {
  try {
    const response = await axiosClient.get<Friend[]>(
      API_ROUTES.users.getFriends
    );
    return response.data;
  } catch (error) {
    console.error("error fetching friends", error);
    throw new Error("Failed to fetch friends");
  }
}

export async function getConversations() {
  try {
    const response = await axiosClient.get<Conversation[]>(
      API_ROUTES.conversations.getConversations
    );
    return response.data;
  } catch (error) {
    console.error("error fetching conversations", error);
    throw new Error("Failed to fetch conversations");
  }
}

export async function createConversation(userId: string) {
  try {
    const response = await axiosClient.post<Conversation>(
      API_ROUTES.conversations.createConversation,
      { userId }
    );
    return response.data;
  } catch (error) {
    console.error("error creating conversation", error);
    throw new Error("Failed to create conversation");
  }
}

export async function getMe() {
  try {
    const response = await axiosClient.get<User>(
      API_ROUTES.users.getMe
    );
    return response.data;
  } catch (error) {
    console.error("error fetching profile", error);
    throw new Error("something went wrong");
  }
}

export async function getFriendById(userId: string) {
  try {
    const response = await axiosClient.get<User>(
      API_ROUTES.users.getFriendById(userId)
    );
    return response.data;
  } catch (error) {
    console.error("error fetching user details", error);
    throw new Error("something went wrong");
  }
}
