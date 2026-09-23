import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { UsersQueryKeys } from "../query-keys";
import {
  getFriendById,
  getFriendsOnly,
  getMe,
  getUserPreferences,
  blockFriend,
  unblockFriend,
  searchUsers,
  setUserPreferences,
  removeMyAvatar,
  updateMe,
  uploadMyAvatar,
} from "./api";
import { Friend, PageResponse, UpdateUserProfileRequest, User, UserPreference } from "./types";
import { ChatQueryKeys } from "../query-keys";

export function useInfiniteSearchUsers(search?: string, size = 10) {
  const queryTerm = search?.trim() ?? "";
  return useInfiniteQuery({
    queryKey: [UsersQueryKeys.SEARCH_USERS, queryTerm, size],
    queryFn: ({ pageParam = 0 }) => searchUsers(queryTerm, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
    enabled: queryTerm.length > 0,
  });
}

export function useInfiniteGetFriendsOnly(size = 10) {
  return useInfiniteQuery({
    queryKey: [UsersQueryKeys.FRIENDS, size],
    queryFn: ({ pageParam = 0 }) => getFriendsOnly(pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) =>
      lastPage.hasMore ? lastPage.page + 1 : undefined,
  });
}

export function useBlockFriend() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (userId) => blockFriend(userId),
    onSuccess: (_data, userId) => {
      queryClient.setQueriesData<{
        pages: PageResponse<Friend>[];
        pageParams: number[];
      }>({ queryKey: [UsersQueryKeys.FRIENDS] }, (existing) => {
        if (!existing) return existing;
        const wasPresent = existing.pages.some((page) =>
          page.content.some((friend) => friend.userId === userId),
        );
        return {
          ...existing,
          pages: existing.pages.map((page, index) => ({
            ...page,
            content: page.content.filter((friend) => friend.userId !== userId),
            totalElements:
              wasPresent && index === 0
                ? Math.max(0, page.totalElements - 1)
                : page.totalElements,
          })),
        };
      });
      queryClient.invalidateQueries({ queryKey: [UsersQueryKeys.FRIENDS] });
      queryClient.invalidateQueries({ queryKey: [UsersQueryKeys.SEARCH_USERS] });
      queryClient.invalidateQueries({ queryKey: [ChatQueryKeys.CONVERSATION] });
      queryClient.invalidateQueries({ queryKey: [ChatQueryKeys.CONVERSATIONS] });
    },
  });
}

export function useUnblockFriend() {
  const queryClient = useQueryClient();

  return useMutation<void, Error, string>({
    mutationFn: (userId) => unblockFriend(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [UsersQueryKeys.FRIENDS] });
      queryClient.invalidateQueries({ queryKey: [UsersQueryKeys.SEARCH_USERS] });
      queryClient.invalidateQueries({ queryKey: [ChatQueryKeys.CONVERSATION] });
      queryClient.invalidateQueries({ queryKey: [ChatQueryKeys.CONVERSATIONS] });
    },
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
    mutationFn: (lastConversationId: string | null) =>
      setUserPreferences(lastConversationId),
    onSuccess: (data) => {
      queryClient.setQueryData([UsersQueryKeys.PREFERENCES], data);
    },
  });
}

export function useUpdateMe() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, UpdateUserProfileRequest>({
    mutationFn: (payload) => updateMe(payload),
    onSuccess: (data) => {
      queryClient.setQueryData([UsersQueryKeys.ME], data);
    },
  });
}

export function useUploadMyAvatar() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, File>({
    mutationFn: (file) => uploadMyAvatar(file),
    onSuccess: (data) => {
      queryClient.setQueryData([UsersQueryKeys.ME], data);
    },
  });
}

export function useRemoveMyAvatar() {
  const queryClient = useQueryClient();

  return useMutation<User, Error, void>({
    mutationFn: () => removeMyAvatar(),
    onSuccess: (data) => {
      queryClient.setQueryData([UsersQueryKeys.ME], data);
    },
  });
}
