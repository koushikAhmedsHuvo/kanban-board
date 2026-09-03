import { Injectable } from "@nestjs/common";
import { BoardRole, Prisma } from "@prisma/client";
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
  BadRequestException,
} from "@nestjs/common";
import { CreateColumnDto } from "./dto/create-column.dto";
import { MoveColumnDto } from "./dto/move-column.dto";
import { UpdateColumnDto } from "./dto/update-column.dto";
import { ColumnsRepository } from "./columns.repository";

@Injectable()
export class ColumnsService {
  constructor(private readonly columnsRepository: ColumnsRepository) {}

  async createColumn(boardId: string, userId: string, dto: CreateColumnDto) {
    await this.validateBoardEditorAccess(boardId, userId);
    const lastColumn = await this.columnsRepository.findLastPosition(boardId);
    const position = (lastColumn?.position ?? 0) + 1000;
    return this.columnsRepository.createColumn(boardId, dto.title, position);
  }

  async getBoardColumns(boardId: string, userId: string) {
    await this.validateBoardMembership(boardId, userId);
    return this.columnsRepository.findBoardColumns(boardId);
  }

  async getColumnById(columnId: string, userId: string) {
    const column = await this.getColumn(columnId);
    await this.validateBoardMembership(column.boardId, userId);
    return {
      id: column.id,
      title: column.title,
      position: column.position,
      board: column.board,
      taskCount: column._count.tasks,
      createdAt: column.createdAt,
      updatedAt: column.updatedAt,
    };
  }

  async updateColumn(columnId: string, userId: string, dto: UpdateColumnDto) {
    const column = await this.getColumn(columnId);
    await this.validateBoardEditorAccess(column.boardId, userId);
    if (dto.title === undefined) {
      throw new BadRequestException("Column title is required");
    }
    try {
      return await this.columnsRepository.updateColumn(columnId, dto.title);
    } catch (error: unknown) {
      this.throwIfColumnNotFound(error);
      throw error;
    }
  }

  async deleteColumn(columnId: string, userId: string) {
    const column = await this.getColumn(columnId);
    await this.validateBoardEditorAccess(column.boardId, userId);
    if (await this.columnsRepository.countTasks(columnId)) {
      throw new ConflictException(
        "Column contains tasks and cannot be deleted",
      );
    }
    await this.columnsRepository.deleteColumn(columnId);
    return { message: "Column deleted successfully" };
  }

  async moveColumn(columnId: string, userId: string, dto: MoveColumnDto) {
    const column = await this.getColumn(columnId);
    await this.validateBoardEditorAccess(column.boardId, userId);
    try {
      await this.columnsRepository.moveColumn(
        column.boardId,
        columnId,
        dto.targetPosition,
      );
      return { message: "Column moved successfully" };
    } catch (error: unknown) {
      this.throwIfColumnNotFound(error);
      throw error;
    }
  }

  async validateBoardMembership(boardId: string, userId: string) {
    const membership = await this.columnsRepository.findMembership(
      boardId,
      userId,
    );
    if (membership) return membership;
    if (!(await this.columnsRepository.findBoard(boardId))) {
      throw new NotFoundException("Board not found");
    }
    throw new ForbiddenException("You are not a member of this board");
  }

  async validateBoardEditorAccess(boardId: string, userId: string) {
    const membership = await this.validateBoardMembership(boardId, userId);
    if (
      membership.role !== BoardRole.OWNER &&
      membership.role !== BoardRole.EDITOR
    ) {
      throw new ForbiddenException(
        "Only board owners and editors can modify columns",
      );
    }
    return membership;
  }

  async validateColumnAccess(columnId: string, userId: string) {
    const column = await this.getColumn(columnId);
    await this.validateBoardMembership(column.boardId, userId);
    return column;
  }

  private async getColumn(columnId: string) {
    const column = await this.columnsRepository.findById(columnId);
    if (!column) throw new NotFoundException("Column not found");
    return column;
  }

  private throwIfColumnNotFound(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundException("Column not found");
    }
  }
}
