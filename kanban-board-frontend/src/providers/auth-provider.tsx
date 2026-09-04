"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoaderCircle } from "lucide-react";

import { useMe } from "@/features/auth/hooks/use-me";
import { useAuthStore } from "@/store/auth.store";

const PUBLIC_PATHS = new Set(["/", "/login", "/register"]);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [hydrated, setHydrated] = useState(() =>
    useAuthStore.persist.hasHydrated(),
  );
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const setRestoring = useAuthStore((state) => state.setRestoring);
  const { data: user, isError } = useMe();

  useEffect(() => {
    const finish = () => {
      setHydrated(true);
      setRestoring(false);
    };
    const unsubscribe = useAuthStore.persist.onFinishHydration(finish);
    if (useAuthStore.persist.hasHydrated()) finish();
    return unsubscribe;
  }, [setRestoring]);

  useEffect(() => {
    if (user) setUser(user);
    if (isError) logout();
  }, [user, isError, setUser, logout]);

  if (!hydrated && !PUBLIC_PATHS.has(pathname)) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoaderCircle className="size-6 animate-spin text-primary" />
      </div>
    );
  }

  return <>{children}</>;
}
