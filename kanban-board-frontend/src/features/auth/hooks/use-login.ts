"use client";

import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

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
      toast.success("Welcome back");
    },
    onError: (error) => {
      toast.error(error instanceof Error ? error.message : "Unable to log in");
    },
  });
}
