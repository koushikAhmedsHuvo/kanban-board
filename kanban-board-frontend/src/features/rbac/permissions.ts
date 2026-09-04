export type BoardRole = "OWNER" | "EDITOR" | "VIEWER";

export type Permission =
  | "BOARD_CREATE"
  | "BOARD_UPDATE"
  | "BOARD_DELETE"
  | "MEMBER_INVITE"
  | "MEMBER_UPDATE_ROLE"
  | "MEMBER_REMOVE"
  | "COLUMN_CREATE"
  | "COLUMN_UPDATE"
  | "COLUMN_DELETE"
  | "COLUMN_MOVE"
  | "TASK_CREATE"
  | "TASK_UPDATE"
  | "TASK_DELETE"
  | "TASK_MOVE";

export function hasPermission(
  role: BoardRole | null | undefined,
  permission: Permission,
): boolean {
  if (!role) return false;
  if (role === "OWNER") return true;
  if (role === "VIEWER") return false;
  return permission.startsWith("COLUMN_") || permission.startsWith("TASK_");
}
