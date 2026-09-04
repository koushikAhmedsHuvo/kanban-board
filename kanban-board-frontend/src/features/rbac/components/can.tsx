"use client";

import type { Permission } from "../permissions";
import { usePermission } from "../use-permission";

export function Can({
  permission,
  children,
}: {
  permission: Permission;
  children: React.ReactNode;
}) {
  const { can } = usePermission();
  return can(permission) ? <>{children}</> : null;
}
