import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../../prisma/prisma.service";

export type MoveTaskRecord = { id: string; columnId: string; position: number };
export type OrderedTaskRecord = { id: string; position: number };

@Injectable()
export class TaskMoveRepository {
  constructor(private readonly prisma: PrismaService) {}

  findTask(
    tx: Prisma.TransactionClient,
    taskId: string,
  ): Promise<MoveTaskRecord | null> {
    return tx.task.findUnique({
      where: { id: taskId },
      select: { id: true, columnId: true, position: true },
    });
  }

  findColumn(
    tx: Prisma.TransactionClient,
    columnId: string,
  ): Promise<{ id: string } | null> {
    return tx.column.findUnique({
      where: { id: columnId },
      select: { id: true },
    });
  }

  findColumnTasks(
    tx: Prisma.TransactionClient,
    columnId: string,
  ): Promise<OrderedTaskRecord[]> {
    return tx.task.findMany({
      where: { columnId },
      select: { id: true, position: true },
      orderBy: { position: "asc" },
    });
  }

  findNeighborTasks(
    tx: Prisma.TransactionClient,
    columnId: string,
    index: number,
  ): Promise<OrderedTaskRecord[]> {
    return this.findColumnTasks(tx, columnId).then((tasks) =>
      tasks.slice(Math.max(0, index - 1), index + 1),
    );
  }

  lockColumns(
    tx: Prisma.TransactionClient,
    columnIds: string[],
  ): Promise<unknown> {
    return tx.$queryRaw`SELECT id FROM "columns" WHERE id IN (${Prisma.join(columnIds)}) ORDER BY id FOR UPDATE`;
  }

  lockColumnTasks(
    tx: Prisma.TransactionClient,
    columnIds: string[],
  ): Promise<unknown> {
    return tx.$queryRaw`SELECT id FROM "tasks" WHERE "columnId" IN (${Prisma.join(columnIds)}) ORDER BY "columnId", position FOR UPDATE`;
  }

  updateTaskPosition(
    tx: Prisma.TransactionClient,
    taskId: string,
    columnId: string,
    position: number,
  ): Promise<unknown> {
    return tx.task.update({
      where: { id: taskId },
      data: { columnId, position },
      select: { id: true },
    });
  }

  rebalanceColumn(
    tx: Prisma.TransactionClient,
    columnId: string,
  ): Promise<void> {
    return this.findColumnTasks(tx, columnId).then(async (tasks) => {
      for (const [index, task] of tasks.entries()) {
        await tx.task.update({
          where: { id: task.id },
          data: { position: -(index + 1) },
          select: { id: true },
        });
      }
      for (const [index, task] of tasks.entries()) {
        await tx.task.update({
          where: { id: task.id },
          data: { position: (index + 1) * 1000 },
          select: { id: true },
        });
      }
    });
  }

  transaction<T>(
    callback: (tx: Prisma.TransactionClient) => Promise<T>,
  ): Promise<T> {
    return this.prisma.$transaction(callback, {
      isolationLevel: Prisma.TransactionIsolationLevel.Serializable,
    });
  }
}
