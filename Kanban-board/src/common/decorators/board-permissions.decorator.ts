import { SetMetadata } from "@nestjs/common";
import { BoardPermission } from "../enums/board-permission.enum";

export const BOARD_PERMISSIONS_KEY = "board_permissions";
export const BoardPermissions = (...permissions: BoardPermission[]) =>
  SetMetadata(BOARD_PERMISSIONS_KEY, permissions);
