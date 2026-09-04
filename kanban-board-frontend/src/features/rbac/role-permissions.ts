import type { BoardRole } from "./permissions";
import type { Permission } from "./permissions";

export const ROLE_PERMISSIONS: Record<BoardRole, readonly Permission[]> = {
  OWNER: [
    "BOARD_CREATE",
    "BOARD_UPDATE",
    "BOARD_DELETE",
    "MEMBER_INVITE",
    "MEMBER_UPDATE_ROLE",
    "MEMBER_REMOVE",
    "COLUMN_CREATE",
    "COLUMN_UPDATE",
    "COLUMN_DELETE",
    "COLUMN_MOVE",
    "TASK_CREATE",
    "TASK_UPDATE",
    "TASK_DELETE",
    "TASK_MOVE",
  ],
  EDITOR: [
    "COLUMN_CREATE",
    "COLUMN_UPDATE",
    "COLUMN_DELETE",
    "COLUMN_MOVE",
    "TASK_CREATE",
    "TASK_UPDATE",
    "TASK_DELETE",
    "TASK_MOVE",
  ],
  VIEWER: [],
};
