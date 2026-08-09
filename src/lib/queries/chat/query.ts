import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ChatQueryKeys, UsersQueryKeys } from "../query-keys";
import {
  createConversation,
  getConversationById,
  getConversations,
  updateGroupConversation,
} from "./api";
import {
  Conversation,
  ConversationDetail,
  CreateConversationRequest,
  UpdateGroupConversationRequest,
} from "./types";

export function useGetConversations() {
  return useQuery<Conversation[]>({
    queryKey: [ChatQueryKeys.CONVERSATIONS],
    queryFn: getConversations,
    staleTime: Infinity,
  });
}

export function useGetConversation(conversationId: string) {
  return useQuery<ConversationDetail>({
    queryKey: [ChatQueryKeys.CONVERSATION, conversationId],
    queryFn: () => getConversationById(conversationId),
    enabled: !!conversationId,
    staleTime: Infinity,
    retry: false,
  });
}

export function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, CreateConversationRequest>({
    mutationFn: (request) => createConversation(request),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [ChatQueryKeys.CONVERSATIONS] });
      // known FE seam: creating a DIRECT conversation also mutates friendships (User domain)
      queryClient.invalidateQueries({ queryKey: [UsersQueryKeys.FRIENDS] });
    },
  });
}

export function useUpdateGroupConversation(conversationId: string) {
  const queryClient = useQueryClient();

  return useMutation<
    Conversation,
    Error,
    UpdateGroupConversationRequest
  >({
    mutationFn: (request) => updateGroupConversation(conversationId, request),
    onSuccess: (updated) => {
      queryClient.setQueryData<Conversation[]>(
        [ChatQueryKeys.CONVERSATIONS],
        (existing) =>
          existing?.map((conversation) =>
            conversation.id === updated.id
              ? {
                  ...conversation,
                  name: updated.name,
                  about: updated.about,
                  image: updated.image,
                  updatedAt: updated.updatedAt,
                }
              : conversation,
          ),
      );

      queryClient.setQueryData<ConversationDetail>(
        [ChatQueryKeys.CONVERSATION, conversationId],
        (existing) =>
          existing
            ? {
                ...existing,
                name: updated.name,
                about: updated.about,
                image: updated.image,
                updatedAt: updated.updatedAt,
              }
            : existing,
      );
    },
  });
}
