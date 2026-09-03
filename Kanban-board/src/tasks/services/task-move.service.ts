import { Injectable, Logger, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import {
  TaskMoveRepository,
  OrderedTaskRecord,
} from "../repositories/task-move.repository";

const GAP = 1000;
const MAX_RETRIES = 3;

export class TaskMovedEvent {
  constructor(
    readonly taskId: string,
    readonly sourceColumnId: string,
    readonly targetColumnId: string,
    readonly oldPosition: number,
    readonly newPosition: number,
  ) {}
}

@Injectable()
export class TaskMoveService {
  private readonly logger = new Logger(TaskMoveService.name);

  constructor(private readonly repository: TaskMoveRepository) {}

  async moveTask(
    taskId: string,
    targetColumnId: string,
    targetIndex: number,
  ): Promise<void> {
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt += 1) {
      try {
        await this.repository.transaction(async (tx) =>
          this.moveInTransaction(tx, taskId, targetColumnId, targetIndex),
        );
        return;
      } catch (error: unknown) {
        if (!this.isRetryable(error) || attempt === MAX_RETRIES) throw error;
        this.logger.warn({
          event: "TaskMoveRetry",
          taskId,
          targetColumnId,
          targetIndex,
          attempt,
        });
      }
    }
  }

  calculatePosition(previousPosition?: number, nextPosition?: number): number {
    if (previousPosition === undefined && nextPosition === undefined)
      return GAP;
    if (previousPosition === undefined) return Math.floor(nextPosition! / 2);
    if (nextPosition === undefined) return previousPosition + GAP;
    return Math.floor((previousPosition + nextPosition) / 2);
  }

  rebalanceColumn(columnId: string): Promise<void> {
    return this.repository.transaction((tx) =>
      this.repository.rebalanceColumn(tx, columnId),
    );
  }

  private async moveInTransaction(
    tx: Prisma.TransactionClient,
    taskId: string,
    targetColumnId: string,
    targetIndex: number,
  ): Promise<void> {
    const task = await this.repository.findTask(tx, taskId);
    if (!task) throw new NotFoundException("Task not found");
    if (!(await this.repository.findColumn(tx, targetColumnId)))
      throw new NotFoundException("Target column not found");

    const sourceColumnId = task.columnId;
    const columnIds = [...new Set([sourceColumnId, targetColumnId])].sort();
    await this.repository.lockColumns(tx, columnIds);
    await this.repository.lockColumnTasks(tx, columnIds);

    const sourceTasks = await this.repository.findColumnTasks(
      tx,
      sourceColumnId,
    );
    const targetTasks =
      sourceColumnId === targetColumnId
        ? sourceTasks
        : await this.repository.findColumnTasks(tx, targetColumnId);
    const sourceIndex = sourceTasks.findIndex((item) => item.id === taskId);
    if (sourceIndex < 0) throw new NotFoundException("Task not found");
    const remainingTarget = targetTasks.filter((item) => item.id !== taskId);
    const boundedIndex = Math.max(
      0,
      Math.min(targetIndex, remainingTarget.length),
    );
    if (sourceColumnId === targetColumnId && boundedIndex === sourceIndex)
      return;

    let previous = remainingTarget[boundedIndex - 1]?.position;
    let next = remainingTarget[boundedIndex]?.position;
    let newPosition = this.calculatePosition(previous, next);
    if (previous !== undefined && next !== undefined && next - previous <= 1) {
      this.logger.warn({
        event: "TaskMoveRebalanceTriggered",
        columnId: targetColumnId,
        taskId,
      });
      await this.repository.rebalanceColumn(tx, targetColumnId);
      const rebalancedTarget = await this.repository.findColumnTasks(
        tx,
        targetColumnId,
      );
      const remaining = rebalancedTarget.filter((item) => item.id !== taskId);
      previous = remaining[boundedIndex - 1]?.position;
      next = remaining[boundedIndex]?.position;
      newPosition = this.calculatePosition(previous, next);
    }

    if (sourceColumnId !== targetColumnId) {
      await this.repository.updateTaskPosition(
        tx,
        taskId,
        sourceColumnId,
        this.temporaryPosition(sourceTasks),
      );
    }
    await this.repository.updateTaskPosition(
      tx,
      taskId,
      targetColumnId,
      this.temporaryPosition(targetTasks),
    );
    await this.repository.updateTaskPosition(
      tx,
      taskId,
      targetColumnId,
      newPosition,
    );
    this.logger.log(
      new TaskMovedEvent(
        taskId,
        sourceColumnId,
        targetColumnId,
        task.position,
        newPosition,
      ),
    );
  }

  private temporaryPosition(tasks: OrderedTaskRecord[]): number {
    return -(tasks.length + 1);
  }

  private isRetryable(error: unknown): boolean {
    return (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      (error.code === "P2002" || error.code === "P2034")
    );
  }
}
