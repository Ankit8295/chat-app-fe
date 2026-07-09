import axios from "axios";
import { cookies } from "next/headers";

const API_BASE_URL = process.env.BACKEND_API_URL ?? "http://localhost:8080";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
  withCredentials: true,
});

apiClient.interceptors.request.use(async (config) => {
  const token = (await cookies()).get("access_token")?.value;

  if (token) {
    config.headers.set("Cookie", `access_token=${token}`);
  }

  return config;
});
