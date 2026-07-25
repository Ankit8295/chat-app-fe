import { useQuery } from "@tanstack/react-query";
import { UsersQueryKeys } from "../query-keys";
import { getAllFriends, getFriendById, getMe } from "./api";
import { User } from "./types";

function useGetAllFriends() {
  return useQuery<User[]>({
    queryKey: [UsersQueryKeys.ALL_FRIENDS],
    queryFn: getAllFriends,
    staleTime: Infinity, // Friends list is loaded at root startup; cache indefinitely and invalidate on manual modifications/socket events
  });
}

function useGetMe() {
  return useQuery<User>({
    queryKey: [UsersQueryKeys.ME],
    queryFn: getMe,
    staleTime: Infinity, // The current user's profile details rarely change, cache indefinitely until explicitly invalidated
  });
}

function useGetFriend(friendId: string) {
  return useQuery<User>({
    queryKey: [UsersQueryKeys.FRIEND, friendId],
    queryFn: () => getFriendById(friendId),
    enabled: !!friendId,
  });
}
export { useGetFriend, useGetAllFriends, useGetMe };
