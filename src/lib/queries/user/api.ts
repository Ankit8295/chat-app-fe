import axios from "axios";
import { API_ROUTES } from "@/lib/api/api-routes";
import { axiosClient } from "@/lib/api/axios-client";
import {
  AvatarConfirmRequest,
  AvatarPresignRequest,
  Friend,
  OwnIdentityKey,
  PageResponse,
  ProfilePresignedUrlResponse,
  PublicIdentityKey,
  UpdateUserProfileRequest,
  UpsertIdentityKeyRequest,
  User,
  UserPreference,
  UserSearchResult,
} from "./types";

export async function searchUsers(
  search?: string,
  page = 0,
  size = 10,
): Promise<PageResponse<UserSearchResult>> {
  try {
    const response = await axiosClient.get<PageResponse<UserSearchResult>>(
      API_ROUTES.users.searchUsers,
      {
        params: {
          ...(search ? { search } : {}),
          page,
          size,
        },
      },
    );
    return response.data;
  } catch (error) {
    console.error("error searching users", error);
    throw new Error("Failed to search users");
  }
}

export async function getFriendsOnly(
  page = 0,
  size = 10,
): Promise<PageResponse<Friend>> {
  try {
    const response = await axiosClient.get<PageResponse<Friend>>(
      API_ROUTES.users.getFriends,
      {
        params: { page, size },
      },
    );
    return response.data;
  } catch (error) {
    console.error("error fetching friends", error);
    throw new Error("Failed to fetch friends");
  }
}

export async function removeFriend(friendUserId: string): Promise<void> {
  try {
    await axiosClient.delete(API_ROUTES.users.removeFriend(friendUserId));
  } catch (error) {
    console.error("error removing friend", error);
    throw new Error("Failed to remove friend");
  }
}

export async function blockFriend(userId: string): Promise<void> {
  try {
    await axiosClient.post(API_ROUTES.users.blockFriend(userId));
  } catch (error) {
    console.error("error blocking user", error);
    throw new Error("Failed to block user");
  }
}

export async function unblockFriend(userId: string): Promise<void> {
  try {
    await axiosClient.delete(API_ROUTES.users.unblockFriend(userId));
  } catch (error) {
    console.error("error unblocking user", error);
    throw new Error("Failed to unblock user");
  }
}

export async function getMe(): Promise<User> {
  try {
    const response = await axiosClient.get<User>(API_ROUTES.users.getMe);
    return response.data;
  } catch (error) {
    console.error("error fetching profile", error);
    throw new Error("something went wrong");
  }
}

export async function updateMe(
  payload: UpdateUserProfileRequest,
): Promise<User> {
  try {
    const response = await axiosClient.put<User>(
      API_ROUTES.users.updateMe,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("error updating profile", error);
    throw new Error("something went wrong");
  }
}

export async function presignAvatar(
  payload: AvatarPresignRequest,
): Promise<ProfilePresignedUrlResponse> {
  try {
    const response = await axiosClient.post<ProfilePresignedUrlResponse>(
      API_ROUTES.users.presignAvatar,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("error requesting avatar presign", error);
    throw new Error("something went wrong");
  }
}

export async function uploadAvatarToPresignedUrl(
  uploadUrl: string,
  file: File,
  headers: Record<string, string>,
): Promise<void> {
  const response = await fetch(uploadUrl, {
    method: "PUT",
    body: file,
    headers,
  });

  if (!response.ok) {
    console.error("error uploading avatar to storage", response.status);
    throw new Error("something went wrong");
  }
}

export async function confirmAvatar(
  payload: AvatarConfirmRequest,
): Promise<User> {
  try {
    const response = await axiosClient.post<User>(
      API_ROUTES.users.confirmAvatar,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("error confirming avatar upload", error);
    throw new Error("something went wrong");
  }
}

export async function removeMyAvatar(): Promise<User> {
  try {
    const response = await axiosClient.delete<User>(
      API_ROUTES.users.removeAvatar,
    );
    return response.data;
  } catch (error) {
    console.error("error removing avatar", error);
    throw new Error("something went wrong");
  }
}

export async function uploadMyAvatar(file: File): Promise<User> {
  const presign = await presignAvatar({
    contentType: file.type,
    fileName: file.name,
    sizeBytes: file.size,
  });
  await uploadAvatarToPresignedUrl(presign.uploadUrl, file, presign.headers);
  return confirmAvatar({ mediaId: presign.mediaId });
}

export async function getFriendById(userId: string): Promise<User> {
  try {
    const response = await axiosClient.get<User>(
      API_ROUTES.users.getFriendById(userId),
    );
    return response.data;
  } catch (error) {
    console.error("error fetching user details", error);
    throw new Error("something went wrong");
  }
}

export async function getUserPreferences(): Promise<UserPreference> {
  try {
    const response = await axiosClient.get<UserPreference>(
      API_ROUTES.users.getPreferences,
    );
    return response.data;
  } catch (error) {
    console.error("error fetching user preferences", error);
    throw new Error("Failed to fetch user preferences");
  }
}

export async function setUserPreferences(
  lastConversationId: string | null,
): Promise<UserPreference> {
  try {
    const response = await axiosClient.post<UserPreference>(
      API_ROUTES.users.setPreferences,
      {
        lastConversationId,
      },
    );
    return response.data;
  } catch (error) {
    console.error("error setting user preferences", error);
    throw new Error("Failed to set user preferences");
  }
}

export async function getMyCrypto(): Promise<OwnIdentityKey | null> {
  try {
    const response = await axiosClient.get<OwnIdentityKey>(
      API_ROUTES.users.getMyCrypto,
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("error fetching identity keys", error);
    throw new Error("Failed to fetch identity keys");
  }
}

export async function putMyCrypto(
  payload: UpsertIdentityKeyRequest,
): Promise<OwnIdentityKey> {
  try {
    const response = await axiosClient.put<OwnIdentityKey>(
      API_ROUTES.users.putMyCrypto,
      payload,
    );
    return response.data;
  } catch (error) {
    console.error("error saving identity keys", error);
    throw new Error("Failed to save identity keys");
  }
}

export async function getPublicCrypto(
  ids: string[],
): Promise<PublicIdentityKey[]> {
  if (ids.length === 0) return [];
  try {
    const response = await axiosClient.get<PublicIdentityKey[]>(
      API_ROUTES.users.getPublicCrypto,
      { params: { ids: ids.join(",") } },
    );
    return response.data;
  } catch (error) {
    console.error("error fetching public keys", error);
    throw new Error("Failed to fetch public keys");
  }
}
