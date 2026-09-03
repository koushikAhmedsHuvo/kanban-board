import { BoardRole } from "@prisma/client";
import { BoardPermission } from "../enums/board-permission.enum";

export const BOARD_ROLE_PERMISSIONS: Record<
  BoardRole,
  readonly BoardPermission[]
> = {
  [BoardRole.OWNER]: Object.values(BoardPermission),
  [BoardRole.EDITOR]: [
    BoardPermission.VIEW_BOARD,
    BoardPermission.CREATE_COLUMN,
    BoardPermission.UPDATE_COLUMN,
    BoardPermission.DELETE_COLUMN,
    BoardPermission.MOVE_COLUMN,
    BoardPermission.CREATE_TASK,
    BoardPermission.UPDATE_TASK,
    BoardPermission.DELETE_TASK,
    BoardPermission.MOVE_TASK,
  ],
  [BoardRole.VIEWER]: [BoardPermission.VIEW_BOARD],
};
