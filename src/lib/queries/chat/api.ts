import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import { Conversation, ConversationDetail, CreateConversationRequest } from "./types";

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
