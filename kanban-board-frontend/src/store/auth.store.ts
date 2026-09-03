import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { User } from "@/types/auth";

interface AuthState {
  user: User | null;
  token: string | null;
  isRestoring: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setRestoring: (isRestoring: boolean) => void;
  logout: () => void;
}

function setAuthCookie(token: string | null) {
  if (typeof document === "undefined") return;
  document.cookie = token
    ? `auth-token=${encodeURIComponent(token)}; path=/; max-age=604800; SameSite=Lax`
    : "auth-token=; path=/; max-age=0; SameSite=Lax";
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isRestoring: true,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        setAuthCookie(token);
        set({ token });
      },
      setRestoring: (isRestoring) => set({ isRestoring }),
      logout: () => {
        setAuthCookie(null);
        if (typeof window !== "undefined")
          localStorage.removeItem("auth-token");
        set({ user: null, token: null, isRestoring: false });
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ user: state.user, token: state.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) setAuthCookie(state.token);
        state?.setRestoring(false);
      },
    },
  ),
);
