"use client";

import { useEffect } from "react";
import { LoaderCircle } from "lucide-react";

import { useMe } from "@/features/auth/hooks/use-me";
import { useAuthStore } from "@/store/auth.store";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const token = useAuthStore((state) => state.token);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const setRestoring = useAuthStore((state) => state.setRestoring);
  const isRestoring = useAuthStore((state) => state.isRestoring);
  const { data: user, isLoading, isError } = useMe();

  useEffect(() => {
    if (user) setUser(user);
    if (isError) logout();
    if (!token || !isLoading) setRestoring(false);
  }, [user, isError, isLoading, token, setUser, logout, setRestoring]);

  if (isRestoring) {
    return <div className="flex min-h-screen items-center justify-center"><LoaderCircle className="size-6 animate-spin text-primary" /></div>;
  }

  return <>{children}</>;
}
