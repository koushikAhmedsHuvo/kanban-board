import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { PrismaService } from "../../prisma/prisma.service";
import { AuthenticatedRequest } from "../interfaces/authenticated-request.interface";

@Injectable()
export class BoardAccessGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<AuthenticatedRequest>();
    const boardId = await this.resolveBoardId(request);
    const userId = request.user?.sub;
    if (!userId)
      throw new ForbiddenException("You do not have access to this board");

    const membership = await this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
      select: { boardId: true, userId: true, role: true },
    });
    if (!membership)
      throw new ForbiddenException("You do not have access to this board");
    request.boardMembership = membership;
    return true;
  }

  private async resolveBoardId(request: AuthenticatedRequest): Promise<string> {
    const boardId = this.getRouteParam(request, "boardId");
    if (boardId) return boardId;
    const columnId = this.getRouteParam(request, "columnId");
    if (columnId) {
      const column = await this.prisma.column.findUnique({
        where: { id: columnId },
        select: { boardId: true },
      });
      if (!column) throw new NotFoundException("Column not found");
      return column.boardId;
    }
    const taskId = this.getRouteParam(request, "taskId");
    if (taskId) {
      const task = await this.prisma.task.findUnique({
        where: { id: taskId },
        select: { columnId: true },
      });
      if (!task) throw new NotFoundException("Task not found");
      const column = await this.prisma.column.findUnique({
        where: { id: task.columnId },
        select: { boardId: true },
      });
      if (!column) throw new NotFoundException("Column not found");
      return column.boardId;
    }
    throw new ForbiddenException("You do not have access to this board");
  }

  private getRouteParam(
    request: AuthenticatedRequest,
    name: string,
  ): string | undefined {
    const value = request.params[name];
    return typeof value === "string" ? value : undefined;
  }
}
