"use client";

import { usePermissionContext } from "./permission-provider";

export function usePermission() {
  const { role, can } = usePermissionContext();
  return {
    role,
    can,
    canCreateBoard: can("BOARD_CREATE"),
    canUpdateBoard: can("BOARD_UPDATE"),
    canDeleteBoard: can("BOARD_DELETE"),
    canInviteMember: can("MEMBER_INVITE"),
    canUpdateMemberRole: can("MEMBER_UPDATE_ROLE"),
    canRemoveMember: can("MEMBER_REMOVE"),
    canCreateColumn: can("COLUMN_CREATE"),
    canUpdateColumn: can("COLUMN_UPDATE"),
    canDeleteColumn: can("COLUMN_DELETE"),
    canMoveColumn: can("COLUMN_MOVE"),
    canCreateTask: can("TASK_CREATE"),
    canUpdateTask: can("TASK_UPDATE"),
    canDeleteTask: can("TASK_DELETE"),
    canMoveTask: can("TASK_MOVE"),
  };
}
