import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { UsersQueryKeys } from "../query-keys";
import {
  searchUsers,
  getFriendsOnly,
  getConversations,
  createConversation,
  getFriendById,
  getMe,
} from "./api";
import { User, UserSearchResult, Friend, Conversation } from "./types";

function useSearchUsers(search?: string) {
  return useQuery<UserSearchResult[]>({
    queryKey: [UsersQueryKeys.SEARCH_USERS, search ?? ""],
    queryFn: () => searchUsers(search),
  });
}

function useGetFriendsOnly() {
  return useQuery<Friend[]>({
    queryKey: [UsersQueryKeys.FRIENDS],
    queryFn: getFriendsOnly,
    staleTime: Infinity,
  });
}

function useGetConversations() {
  return useQuery<Conversation[]>({
    queryKey: [UsersQueryKeys.CONVERSATIONS],
    queryFn: getConversations,
    staleTime: Infinity,
  });
}

function useCreateConversation() {
  const queryClient = useQueryClient();

  return useMutation<Conversation, Error, string>({
    mutationFn: (userId: string) => createConversation(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UsersQueryKeys.CONVERSATIONS] });
      queryClient.invalidateQueries({ queryKey: [UsersQueryKeys.FRIENDS] });
    },
  });
}

function useGetMe() {
  return useQuery<User>({
    queryKey: [UsersQueryKeys.ME],
    queryFn: getMe,
    staleTime: Infinity,
  });
}

function useGetFriend(friendId: string) {
  return useQuery<User>({
    queryKey: [UsersQueryKeys.FRIEND, friendId],
    queryFn: () => getFriendById(friendId),
    enabled: !!friendId,
  });
}

export {
  useSearchUsers,
  useGetFriendsOnly,
  useGetConversations,
  useCreateConversation,
  useGetMe,
  useGetFriend,
};
