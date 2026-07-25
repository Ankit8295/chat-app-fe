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
} from "./api";
import { User, Conversation } from "./types";

function useInfiniteSearchUsers(search?: string, size = 10) {
  return useInfiniteQuery({
    queryKey: [UsersQueryKeys.SEARCH_USERS, search ?? "", size],
    queryFn: ({ pageParam = 0 }) => searchUsers(search, pageParam, size),
    initialPageParam: 0,
    getNextPageParam: (lastPage) => (lastPage.hasMore ? lastPage.page + 1 : undefined),
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

export {
  useInfiniteSearchUsers,
  useInfiniteGetFriendsOnly,
  useGetConversations,
  useCreateConversation,
  useGetMe,
  useGetFriend,
};
