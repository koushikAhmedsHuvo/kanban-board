import { Injectable } from "@nestjs/common";
import { BoardRole } from "@prisma/client";
import { BOARD_ROLE_PERMISSIONS } from "../constants/board-permissions.constant";
import { BoardPermission } from "../enums/board-permission.enum";

@Injectable()
export class PermissionService {
  getPermissions(role: BoardRole): readonly BoardPermission[] {
    return BOARD_ROLE_PERMISSIONS[role] ?? [];
  }

  hasPermission(role: BoardRole, permission: BoardPermission): boolean {
    return this.getPermissions(role).includes(permission);
  }
}
