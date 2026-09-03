"use client";

import { useQuery } from "@tanstack/react-query";

import { getCurrentUser } from "../api/me";
import { useAuthStore } from "@/store/auth.store";

export function useMe() {
  const token = useAuthStore((state) => state.token);
  return useQuery({
    queryKey: ["auth", "me"],
    queryFn: getCurrentUser,
    enabled: Boolean(token),
    retry: false,
  });
}
