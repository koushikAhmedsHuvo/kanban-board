import axios from "axios";

import { env } from "@/env";
import { useAuthStore } from "@/store/auth.store";
import { getErrorMessage } from "@/lib/error-handler";
import { toastError } from "@/lib/toast";

export const apiClient = axios.create({
  baseURL: env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token =
      useAuthStore.getState().token ?? localStorage.getItem("auth-token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const requestUrl = String(error.config?.url ?? "");
    const isAuthAttempt =
      requestUrl.includes("/auth/login") ||
      requestUrl.includes("/auth/register");

    if (typeof window !== "undefined" && status === 401 && !isAuthAttempt) {
      useAuthStore.getState().logout();
      if (!window.location.pathname.startsWith("/login")) {
        window.location.assign("/login");
      }
    } else if (
      typeof window !== "undefined" &&
      error.config?.method?.toLowerCase() === "get" &&
      status !== 401
    ) {
      toastError(getErrorMessage(error));
    }

    return Promise.reject(error);
  },
);
