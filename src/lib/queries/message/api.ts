import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import { GetMessagesParams, WireMessagePageResponse } from "./types";

export async function getMessages(
  conversationId: string,
  params: GetMessagesParams = {},
): Promise<WireMessagePageResponse> {
  try {
    const response = await axiosClient.get<WireMessagePageResponse>(
      API_ROUTES.conversations.getMessages(conversationId),
      {
        params: {
          ...(params.nextCursor ? { nextCursor: params.nextCursor } : {}),
          ...(params.prevCursor ? { prevCursor: params.prevCursor } : {}),
          ...(params.limit != null ? { limit: params.limit } : {}),
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("error fetching messages", error);
    throw new Error("Failed to fetch messages");
  }
}
