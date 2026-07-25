import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { UsersQueryKeys } from "../query-keys";
import {
  searchUsers,
  getFriendsOnly,
  getConversations,
  createConversation,
  getFriendById,
  getMe,
  getUserPreferences,
  setUserPreferences,
} from "./api";
import { User, Conversation, UserPreference } from "./types";

function useInfiniteSearchUsers(search?: string, size = 10) {
  const queryTerm = search?.trim() ?? "";
  return useInfiniteQuery({
    queryKey: [UsersQueryKeys.SEARCH_USERS, queryTerm, size],
    queryFn: ({ pageParam = 0 }) => searchUsers(queryTerm, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: queryTerm.length > 0,
  });
}

function useInfiniteGetFriendsOnly(size = 10) {
  return useInfiniteQuery({
    queryKey: [UsersQueryKeys.FRIENDS, size],
    queryFn: ({ pageParam = 0 }) => getFriendsOnly(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
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

function useGetUserPreferences() {
  return useQuery<UserPreference>({
    queryKey: [UsersQueryKeys.PREFERENCES],
    queryFn: getUserPreferences,
    staleTime: 60 * 1000,
  });
}

function useSetUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation<UserPreference, Error, string | null>({
    mutationFn: (lastConversationId: string | null) =>
      setUserPreferences(lastConversationId),
    onSuccess: (data) => {
      queryClient.setQueryData([UsersQueryKeys.PREFERENCES], data);
    },
  });
}

export {
  useInfiniteSearchUsers,
  useInfiniteGetFriendsOnly,
  useGetConversations,
  useCreateConversation,
  useGetMe,
  useGetFriend,
  useGetUserPreferences,
  useSetUserPreferences,
};
