import { Injectable } from "@nestjs/common";
import { BoardRole, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const columnSelect = {
  id: true,
  boardId: true,
  title: true,
  position: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ColumnSelect;

export const columnDetailsSelect = {
  ...columnSelect,
  board: { select: { id: true, name: true } },
  _count: { select: { tasks: true } },
} satisfies Prisma.ColumnSelect;

export type ColumnRecord = Prisma.ColumnGetPayload<{
  select: typeof columnSelect;
}>;
export type ColumnDetails = Prisma.ColumnGetPayload<{
  select: typeof columnDetailsSelect;
}>;

export const membershipSelect = {
  role: true,
} satisfies Prisma.BoardMemberSelect;
export type Membership = Prisma.BoardMemberGetPayload<{
  select: typeof membershipSelect;
}>;

@Injectable()
export class ColumnsRepository {
  constructor(private readonly prisma: PrismaService) {}

  findMembership(boardId: string, userId: string): Promise<Membership | null> {
    return this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
      select: membershipSelect,
    });
  }

  findBoard(boardId: string): Promise<{ id: string } | null> {
    return this.prisma.board.findUnique({
      where: { id: boardId },
      select: { id: true },
    });
  }

  createColumn(
    boardId: string,
    title: string,
    position: number,
  ): Promise<ColumnRecord> {
    return this.prisma.column.create({
      data: { boardId, title, position },
      select: columnSelect,
    });
  }

  findById(columnId: string): Promise<ColumnDetails | null> {
    return this.prisma.column.findUnique({
      where: { id: columnId },
      select: columnDetailsSelect,
    });
  }

  findBoardColumns(boardId: string) {
    return this.prisma.column.findMany({
      where: { boardId },
      select: { ...columnSelect, _count: { select: { tasks: true } } },
      orderBy: { position: "asc" },
    });
  }

  updateColumn(columnId: string, title: string): Promise<ColumnRecord> {
    return this.prisma.column.update({
      where: { id: columnId },
      data: { title },
      select: columnSelect,
    });
  }

  countTasks(columnId: string): Promise<number> {
    return this.prisma.task.count({ where: { columnId } });
  }

  deleteColumn(columnId: string): Promise<void> {
    return this.prisma.column
      .delete({ where: { id: columnId } })
      .then(() => undefined);
  }

  findLastPosition(boardId: string): Promise<{ position: number } | null> {
    return this.prisma.column.findFirst({
      where: { boardId },
      select: { position: true },
      orderBy: { position: "desc" },
    });
  }

  moveColumn(
    boardId: string,
    columnId: string,
    targetPosition: number,
  ): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      const column = await tx.column.findUnique({
        where: { id: columnId },
        select: { boardId: true, position: true },
      });
      if (!column || column.boardId !== boardId) {
        throw new Prisma.PrismaClientKnownRequestError("Column not found", {
          code: "P2025",
          clientVersion: Prisma.prismaVersion.client,
        });
      }
      if (column.position === targetPosition) return;

      const minimum = await tx.column.findFirst({
        where: { boardId },
        select: { position: true },
        orderBy: { position: "asc" },
      });
      const temporaryPosition = (minimum?.position ?? 0) - 1;
      await tx.column.update({
        where: { id: columnId },
        data: { position: temporaryPosition },
      });
      await tx.column.update({
        where: { id: columnId },
        data: { position: targetPosition },
      });
    });
  }
}
