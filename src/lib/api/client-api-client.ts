import axios from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_API_URL ?? "http://localhost:8080";

export const clientApiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10_000,
  withCredentials: true,
});
