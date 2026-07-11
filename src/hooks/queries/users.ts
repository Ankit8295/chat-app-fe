import { useQuery } from "@tanstack/react-query";
import { UsersQueryKeys } from "./query-keys";
import { getAllUsers, User } from "@/lib/api/users/users";

function useGetAllUsers() {
  return useQuery<User[]>({
    queryKey: [UsersQueryKeys.USERS],
    queryFn: async () => {
      const response = await getAllUsers();
      //   if (!response.success || !response.data) {
      //     throw new Error(response.error || "Failed to fetch users");
      //   }
      return response;
    },
  });
}
export { useGetAllUsers };
