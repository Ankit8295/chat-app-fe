import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import {
  User,
  UserSearchResult,
  Friend,
  Conversation,
  ConversationDetail,
  PageResponse,
  UserPreference,
  CreateConversationRequest,
} from "./types";

export async function searchUsers(search?: string, page = 0, size = 10): Promise<PageResponse<UserSearchResult>> {
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
    const response = await axiosClient.get<PageResponse<Friend>>(
      API_ROUTES.users.getFriends,
      {
        params: { page, size },
      }
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

export async function getConversationById(conversationId: string) {
  try {
    const response = await axiosClient.get<ConversationDetail>(
      API_ROUTES.conversations.getConversationById(conversationId)
    );
    return response.data;
  } catch (error) {
    console.error("error fetching conversation", error);
    throw new Error("Failed to fetch conversation");
  }
}

export async function createConversation(request: CreateConversationRequest) {
  try {
    const response = await axiosClient.post<Conversation>(
      API_ROUTES.conversations.createConversation,
      request
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

export async function getUserPreferences(): Promise<UserPreference> {
  try {
    const response = await axiosClient.get<UserPreference>(
      API_ROUTES.users.getPreferences
    );
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
    const response = await axiosClient.post<UserPreference>(
      API_ROUTES.users.setPreferences,
      { lastConversationId }
    );
    return response.data;
  } catch (error) {
    console.error("error setting user preferences", error);
    throw new Error("Failed to set user preferences");
  }
}
