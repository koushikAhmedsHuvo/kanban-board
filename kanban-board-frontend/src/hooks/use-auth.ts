"use client";

import { useAuthStore } from "@/store/auth.store";

export function useAuth() {
  const { user, token, setUser, setToken, logout } = useAuthStore();

  return {
    user,
    token,
    isAuthenticated: Boolean(token && user),
    login: (nextToken: string, nextUser: typeof user) => {
      setToken(nextToken);
      setUser(nextUser);
    },
    logout,
  };
}
