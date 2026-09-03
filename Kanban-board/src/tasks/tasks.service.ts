import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { BoardRole, Prisma } from "@prisma/client";
import { CreateTaskDto } from "./dto/create-task.dto";
import { MoveTaskDto } from "./dto/move-task.dto";
import { UpdateTaskDto } from "./dto/update-task.dto";
import { TasksRepository } from "./tasks.repository";
import { TaskMoveService } from "./services/task-move.service";

@Injectable()
export class TasksService {
  constructor(
    private readonly tasksRepository: TasksRepository,
    private readonly taskMoveService: TaskMoveService,
  ) {}

  async createTask(columnId: string, userId: string, dto: CreateTaskDto) {
    const column = await this.getColumn(columnId);
    await this.validateBoardEditorAccess(column.boardId, userId);
    const last = await this.tasksRepository.findLastPosition(columnId);
    return this.tasksRepository.createTask(
      columnId,
      dto.title,
      dto.description,
      (last?.position ?? 0) + 1000,
      userId,
    );
  }

  async getColumnTasks(columnId: string, userId: string) {
    const column = await this.getColumn(columnId);
    await this.validateBoardMembership(column.boardId, userId);
    return this.tasksRepository.findColumnTasks(columnId);
  }

  async getTaskById(taskId: string, userId: string) {
    const task = await this.validateTaskAccess(taskId, userId);
    return task;
  }

  async updateTask(taskId: string, userId: string, dto: UpdateTaskDto) {
    const task = await this.validateTaskEditorAccess(taskId, userId);
    if (dto.title === undefined && dto.description === undefined)
      throw new BadRequestException("At least one task field is required");
    return this.tasksRepository.updateTask(task.id, {
      title: dto.title,
      description: dto.description,
    });
  }

  async deleteTask(taskId: string, userId: string) {
    await this.validateTaskEditorAccess(taskId, userId);
    await this.tasksRepository.deleteTask(taskId);
    return { message: "Task deleted successfully" };
  }

  async moveTask(
    taskId: string,
    targetColumnId: string,
    targetIndex: number,
    userId: string,
  ) {
    const task = await this.validateTaskEditorAccess(taskId, userId);
    const targetColumn = await this.getColumn(targetColumnId);
    if (targetColumn.boardId !== task.column.boardId)
      throw new ForbiddenException(
        "Target column must belong to the same board",
      );
    try {
      await this.taskMoveService.moveTask(taskId, targetColumnId, targetIndex);
      return { message: "Task moved successfully" };
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      )
        throw new NotFoundException("Task or target column not found");
      throw error;
    }
  }

  async validateTaskAccess(taskId: string, userId: string) {
    const task = await this.getTask(taskId);
    await this.validateBoardMembership(task.column.boardId, userId);
    return task;
  }

  async validateTaskEditorAccess(taskId: string, userId: string) {
    const task = await this.validateTaskAccess(taskId, userId);
    const membership = await this.validateBoardMembership(
      task.column.boardId,
      userId,
    );
    if (
      membership.role !== BoardRole.OWNER &&
      membership.role !== BoardRole.EDITOR
    )
      throw new ForbiddenException(
        "Only board owners and editors can modify tasks",
      );
    return task;
  }

  async rebalanceColumnPositions(columnId: string) {
    await this.getColumn(columnId);
    return this.taskMoveService.rebalanceColumn(columnId);
  }

  private async validateBoardMembership(boardId: string, userId: string) {
    const membership = await this.tasksRepository.findMembership(
      boardId,
      userId,
    );
    if (membership) return membership;
    if (!(await this.tasksRepository.findBoard(boardId)))
      throw new NotFoundException("Board not found");
    throw new ForbiddenException("You are not a member of this board");
  }

  private async validateBoardEditorAccess(boardId: string, userId: string) {
    const membership = await this.validateBoardMembership(boardId, userId);
    if (
      membership.role !== BoardRole.OWNER &&
      membership.role !== BoardRole.EDITOR
    )
      throw new ForbiddenException(
        "Only board owners and editors can modify tasks",
      );
    return membership;
  }

  private async getColumn(columnId: string) {
    const column = await this.tasksRepository.findColumn(columnId);
    if (!column) throw new NotFoundException("Column not found");
    return column;
  }

  private async getTask(taskId: string) {
    const task = await this.tasksRepository.findById(taskId);
    if (!task) throw new NotFoundException("Task not found");
    return task;
  }
}
