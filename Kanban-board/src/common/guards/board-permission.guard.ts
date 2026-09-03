import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { BOARD_PERMISSIONS_KEY } from "../decorators/board-permissions.decorator";
import { BoardPermission } from "../enums/board-permission.enum";
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface";
import { PermissionService } from "../services/permission.service";

@Injectable()
export class BoardPermissionGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly permissionService: PermissionService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const permissions =
      this.reflector.getAllAndOverride<BoardPermission[]>(
        BOARD_PERMISSIONS_KEY,
        [context.getHandler(), context.getClass()],
      ) ?? [];
    if (permissions.length === 0) return true;
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const membership = request.boardMembership;
    const allowed =
      membership &&
      permissions.every((permission) =>
        this.permissionService.hasPermission(membership.role, permission),
      );
    if (!allowed)
      throw new ForbiddenException(
        "You do not have permission to perform this action",
      );
    return true;
  }
}
