"use client";

import { createContext, useContext } from "react";
import type { BoardRole, Permission } from "./permissions";
import { hasPermission } from "./permissions";

interface PermissionContextValue {
  role: BoardRole | null;
  can: (permission: Permission) => boolean;
}

const PermissionContext = createContext<PermissionContextValue>({
  role: null,
  can: () => false,
});

export function PermissionProvider({
  role,
  children,
}: {
  role: BoardRole | null | undefined;
  children: React.ReactNode;
}) {
  return (
    <PermissionContext.Provider value={{ role: role ?? null, can: (permission) => hasPermission(role, permission) }}>
      {children}
    </PermissionContext.Provider>
  );
}

export function usePermissionContext() {
  return useContext(PermissionContext);
}
