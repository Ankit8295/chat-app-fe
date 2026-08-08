import { useInfiniteQuery, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UsersQueryKeys } from "../query-keys";
import { getFriendById, getFriendsOnly, getMe, getUserPreferences, searchUsers, setUserPreferences } from "./api";
import { User, UserPreference } from "./types";

export function useInfiniteSearchUsers(search?: string, size = 10) {
  const queryTerm = search?.trim() ?? "";
  return useInfiniteQuery({
    queryKey: [UsersQueryKeys.SEARCH_USERS, queryTerm, size],
    queryFn: ({ pageParam = 0 }) => searchUsers(queryTerm, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
    enabled: queryTerm.length > 0,
  });
}

export function useInfiniteGetFriendsOnly(size = 10) {
  return useInfiniteQuery({
    queryKey: [UsersQueryKeys.FRIENDS, size],
    queryFn: ({ pageParam = 0 }) => getFriendsOnly(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
  });
}

export function useGetMe() {
  return useQuery<User>({
    queryKey: [UsersQueryKeys.ME],
    queryFn: getMe,
    staleTime: Infinity,
  });
}

export function useGetFriend(friendId: string) {
  return useQuery<User>({
    queryKey: [UsersQueryKeys.FRIEND, friendId],
    queryFn: () => getFriendById(friendId),
    enabled: !!friendId,
  });
}

export function useGetUserPreferences() {
  return useQuery<UserPreference>({
    queryKey: [UsersQueryKeys.PREFERENCES],
    queryFn: getUserPreferences,
    staleTime: 60 * 1000,
  });
}

export function useSetUserPreferences() {
  const queryClient = useQueryClient();

  return useMutation<UserPreference, Error, string | null>({
    mutationFn: (lastConversationId: string | null) => setUserPreferences(lastConversationId),
    onSuccess: (data) => {
      queryClient.setQueryData([UsersQueryKeys.PREFERENCES], data);
    },
  });
}
