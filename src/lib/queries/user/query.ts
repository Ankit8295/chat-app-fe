import { useQuery } from "@tanstack/react-query";
import { UsersQueryKeys } from "../query-keys";
import { getAllFriends, getFriendById } from "./api";
import { User } from "./types";

function useGetAllFriends() {
  return useQuery<User[]>({
    queryKey: [UsersQueryKeys.ALL_FRIENDS],
    queryFn: getAllFriends,
  });
}

function useGetFriend(friendId: string) {
  return useQuery<User>({
    queryKey: [UsersQueryKeys.FRIEND, friendId],
    queryFn: () => getFriendById(friendId),
    enabled: !!friendId,
  });
}
export { useGetFriend, useGetAllFriends };
