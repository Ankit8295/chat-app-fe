import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import { Friend, PageResponse, User, UserPreference, UserSearchResult } from "./types";

export async function searchUsers(
  search?: string,
  page = 0,
  size = 10
): Promise<PageResponse<UserSearchResult>> {
  try {
    const response = await axiosClient.get<PageResponse<UserSearchResult>>(
      API_ROUTES.users.searchUsers,
      {
        params: {
          ...(search ? { search } : {}),
          page,
          size,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("error searching users", error);
    throw new Error("Failed to search users");
  }
}

export async function getFriendsOnly(page = 0, size = 10): Promise<PageResponse<Friend>> {
  try {
    const response = await axiosClient.get<PageResponse<Friend>>(API_ROUTES.users.getFriends, {
      params: { page, size },
    });
    return response.data;
  } catch (error) {
    console.error("error fetching friends", error);
    throw new Error("Failed to fetch friends");
  }
}

export async function getMe(): Promise<User> {
  try {
    const response = await axiosClient.get<User>(API_ROUTES.users.getMe);
    return response.data;
  } catch (error) {
    console.error("error fetching profile", error);
    throw new Error("something went wrong");
  }
}

export async function getFriendById(userId: string): Promise<User> {
  try {
    const response = await axiosClient.get<User>(API_ROUTES.users.getFriendById(userId));
    return response.data;
  } catch (error) {
    console.error("error fetching user details", error);
    throw new Error("something went wrong");
  }
}

export async function getUserPreferences(): Promise<UserPreference> {
  try {
    const response = await axiosClient.get<UserPreference>(API_ROUTES.users.getPreferences);
    return response.data;
  } catch (error) {
    console.error("error fetching user preferences", error);
    throw new Error("Failed to fetch user preferences");
  }
}

export async function setUserPreferences(
  lastConversationId: string | null
): Promise<UserPreference> {
  try {
    const response = await axiosClient.post<UserPreference>(API_ROUTES.users.setPreferences, {
      lastConversationId,
    });
    return response.data;
  } catch (error) {
    console.error("error setting user preferences", error);
    throw new Error("Failed to set user preferences");
  }
}
