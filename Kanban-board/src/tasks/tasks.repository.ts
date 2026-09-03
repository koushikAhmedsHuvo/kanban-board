import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const taskSelect = {
  id: true,
  columnId: true,
  title: true,
  description: true,
  position: true,
  createdById: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.TaskSelect;

export const taskDetailsSelect = {
  ...taskSelect,
  column: { select: { id: true, title: true, boardId: true } },
  createdBy: { select: { id: true, name: true } },
} satisfies Prisma.TaskSelect;

export const membershipSelect = {
  role: true,
} satisfies Prisma.BoardMemberSelect;
export type TaskRecord = Prisma.TaskGetPayload<{ select: typeof taskSelect }>;
export type TaskDetails = Prisma.TaskGetPayload<{
  select: typeof taskDetailsSelect;
}>;
export type Membership = Prisma.BoardMemberGetPayload<{
  select: typeof membershipSelect;
}>;

@Injectable()
export class TasksRepository {
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

  findColumn(
    columnId: string,
  ): Promise<{ id: string; boardId: string } | null> {
    return this.prisma.column.findUnique({
      where: { id: columnId },
      select: { id: true, boardId: true },
    });
  }

  createTask(
    columnId: string,
    title: string,
    description: string | undefined,
    position: number,
    createdById: string,
  ): Promise<TaskRecord> {
    return this.prisma.task.create({
      data: { columnId, title, description, position, createdById },
      select: taskSelect,
    });
  }

  findById(taskId: string): Promise<TaskDetails | null> {
    return this.prisma.task.findUnique({
      where: { id: taskId },
      select: taskDetailsSelect,
    });
  }

  findColumnTasks(columnId: string) {
    return this.prisma.task.findMany({
      where: { columnId },
      select: taskSelect,
      orderBy: { position: "asc" },
    });
  }

  findLastPosition(columnId: string): Promise<{ position: number } | null> {
    return this.prisma.task.findFirst({
      where: { columnId },
      select: { position: true },
      orderBy: { position: "desc" },
    });
  }

  updateTask(
    taskId: string,
    data: Pick<Prisma.TaskUpdateInput, "title" | "description">,
  ): Promise<TaskRecord> {
    return this.prisma.task.update({
      where: { id: taskId },
      data,
      select: taskSelect,
    });
  }

  deleteTask(taskId: string): Promise<void> {
    return this.prisma.task
      .delete({ where: { id: taskId } })
      .then(() => undefined);
  }

  async moveTask(
    taskId: string,
    targetColumnId: string,
    targetPosition: number,
  ): Promise<void> {
    await this.prisma.$transaction(async (tx) => {
      const task = await tx.task.findUnique({
        where: { id: taskId },
        select: { columnId: true, position: true },
      });
      const targetColumn = await tx.column.findUnique({
        where: { id: targetColumnId },
        select: { id: true },
      });
      if (!task || !targetColumn) {
        throw new Prisma.PrismaClientKnownRequestError(
          "Task or column not found",
          { code: "P2025", clientVersion: Prisma.prismaVersion.client },
        );
      }

      const sourceColumnId = task.columnId;
      const targetTasks = await tx.task.findMany({
        where: { columnId: targetColumnId, id: { not: taskId } },
        select: { id: true, position: true },
        orderBy: { position: "asc" },
      });
      const temporaryPosition =
        (
          await tx.task.aggregate({
            where: { columnId: sourceColumnId },
            _min: { position: true },
          })
        )._min.position ?? 0;
      await tx.task.update({
        where: { id: taskId },
        data: { position: temporaryPosition - 1 },
      });

      const finalPositions = targetTasks.map((targetTask) => ({
        id: targetTask.id,
        position:
          targetTask.position >= targetPosition
            ? targetTask.position + 1
            : targetTask.position,
      }));
      const allTargetIds = [...finalPositions.map(({ id }) => id), taskId];
      for (const [index, id] of allTargetIds.entries()) {
        await tx.task.update({
          where: { id },
          data: { position: -(index + 1) },
        });
      }
      for (const targetTask of finalPositions) {
        await tx.task.update({
          where: { id: targetTask.id },
          data: { position: targetTask.position },
        });
      }
      await tx.task.update({
        where: { id: taskId },
        data: { columnId: targetColumnId, position: targetPosition },
      });

      for (const columnId of new Set([sourceColumnId, targetColumnId])) {
        const positions = await tx.task.findMany({
          where: { columnId },
          select: { position: true },
          orderBy: { position: "asc" },
        });
        if (
          positions.some(
            (item, index) =>
              index > 0 && item.position - positions[index - 1].position <= 1,
          )
        ) {
          const tasks = await tx.task.findMany({
            where: { columnId },
            select: { id: true },
            orderBy: { position: "asc" },
          });
          for (const [index, item] of tasks.entries()) {
            await tx.task.update({
              where: { id: item.id },
              data: { position: -(index + 100) },
            });
          }
          for (const [index, item] of tasks.entries()) {
            await tx.task.update({
              where: { id: item.id },
              data: { position: (index + 1) * 1000 },
            });
          }
        }
      }
    });
  }

  rebalanceColumnPositions(columnId: string): Promise<void> {
    return this.prisma.$transaction(async (tx) => {
      const tasks = await tx.task.findMany({
        where: { columnId },
        select: { id: true },
        orderBy: { position: "asc" },
      });
      for (const [index, task] of tasks.entries())
        await tx.task.update({
          where: { id: task.id },
          data: { position: -(index + 1) },
        });
      for (const [index, task] of tasks.entries())
        await tx.task.update({
          where: { id: task.id },
          data: { position: (index + 1) * 1000 },
        });
    });
  }
}
