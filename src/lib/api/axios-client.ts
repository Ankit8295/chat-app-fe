import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { API_ROUTES } from "@/lib/api/api-routes";
import { getChatWsClient } from "@/lib/socket/ws-client";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:8080";

type RetryConfig = InternalAxiosRequestConfig & { _retry?: boolean };

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
  withCredentials: true,
});

const refreshClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

function isAuthPath(url?: string) {
  if (!url) return false;
  return (
    url.includes(API_ROUTES.auth.login) ||
    url.includes(API_ROUTES.auth.register) ||
    url.includes(API_ROUTES.auth.refresh) ||
    url.includes(API_ROUTES.auth.logout)
  );
}

async function refreshSession() {
  await refreshClient.post(API_ROUTES.auth.refresh);
}

axiosClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryConfig | undefined;
    if (
      !original ||
      error.response?.status !== 401 ||
      original._retry ||
      isAuthPath(original.url)
    ) {
      return Promise.reject(error);
    }

    original._retry = true;

    try {
      if (!refreshPromise) {
        refreshPromise = refreshSession().finally(() => {
          refreshPromise = null;
        });
      }
      await refreshPromise;
      getChatWsClient().reconnect();
      return axiosClient(original);
    } catch (refreshError) {
      try {
        await refreshClient.post(API_ROUTES.auth.logout);
      } catch {
        // ignore logout failures during session expiry
      }
      if (typeof window !== "undefined") {
        window.location.assign("/login");
      }
      return Promise.reject(refreshError);
    }
  },
);
