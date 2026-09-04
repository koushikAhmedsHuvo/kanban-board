"use client";

import { useMutation } from "@tanstack/react-query";
import { toastError, toastSuccess } from "@/lib/toast";

import { getErrorMessage } from "@/lib/error-handler";
import { login } from "../api/login";
import { useAuthStore } from "@/store/auth.store";

export function useLogin() {
  const setToken = useAuthStore((state) => state.setToken);
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: login,
    onSuccess: (data) => {
      setToken(data.accessToken);
      setUser(data.user);
      toastSuccess("Welcome back");
    },
    onError: (error) => {
      toastError(getErrorMessage(error));
    },
  });
}
