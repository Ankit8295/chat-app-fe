import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import { Conversation, ConversationDetail, ConversationKeysResponse, CreateConversationRequest, PutConversationKeysRequest, UpdateGroupConversationRequest } from "./types";

export async function getConversations(): Promise<Conversation[]> {
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

export async function getConversationById(conversationId: string): Promise<ConversationDetail> {
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

export async function createConversation(
  request: CreateConversationRequest
): Promise<Conversation> {
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

export async function updateGroupConversation(
  conversationId: string,
  request: UpdateGroupConversationRequest
): Promise<Conversation> {
  try {
    const response = await axiosClient.put<Conversation>(
      API_ROUTES.conversations.updateConversation(conversationId),
      request
    );
    return response.data;
  } catch (error) {
    console.error("error updating conversation", error);
    throw new Error("Failed to update conversation");
  }
}

export async function deleteConversation(conversationId: string): Promise<void> {
  try {
    await axiosClient.delete(
      API_ROUTES.conversations.deleteConversation(conversationId),
    );
  } catch (error) {
    console.error("error deleting conversation", error);
    throw new Error("Failed to delete conversation");
  }
}

export async function getConversationKeys(
  conversationId: string,
): Promise<ConversationKeysResponse> {
  try {
    const response = await axiosClient.get<ConversationKeysResponse>(
      API_ROUTES.conversations.getConversationKeys(conversationId),
    );
    return response.data;
  } catch (error) {
    console.error("error fetching conversation keys", error);
    throw new Error("Failed to fetch conversation keys");
  }
}

export async function putConversationKeys(
  conversationId: string,
  request: PutConversationKeysRequest,
): Promise<ConversationKeysResponse> {
  try {
    const response = await axiosClient.put<ConversationKeysResponse>(
      API_ROUTES.conversations.putConversationKeys(conversationId),
      request,
    );
    return response.data;
  } catch (error) {
    console.error("error saving conversation keys", error);
    throw new Error("Failed to save conversation keys");
  }
}
