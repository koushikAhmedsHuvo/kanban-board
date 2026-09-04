import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { CreateBoardDto } from "./dto/create-board.dto";
import { UpdateBoardDto } from "./dto/update-board.dto";
import { BoardsRepository } from "./boards.repository";

@Injectable()
export class BoardsService {
  constructor(private readonly boardsRepository: BoardsRepository) {}

  createBoard(userId: string, createBoardDto: CreateBoardDto) {
    return this.boardsRepository.createBoard(createBoardDto.name, userId);
  }

  getUserBoards(userId: string) {
    return this.boardsRepository.findUserBoards(userId);
  }

  async getBoardDetails(boardId: string, userId: string) {
    const board = await this.validateBoardAccess(boardId, userId);
    const membership = await this.boardsRepository.findMembership(
      boardId,
      userId,
    );
    return {
      id: board.id,
      name: board.name,
      owner: board.owner,
      role: membership?.role,
      memberCount: board._count.members,
      columnCount: board._count.columns,
      createdAt: board.createdAt,
      updatedAt: board.updatedAt,
    };
  }

  async updateBoard(
    boardId: string,
    userId: string,
    updateBoardDto: UpdateBoardDto,
  ) {
    await this.validateBoardOwner(boardId, userId);
    try {
      return await this.boardsRepository.updateBoard(boardId, {
        name: updateBoardDto.name,
      });
    } catch (error: unknown) {
      this.throwIfBoardNotFound(error);
      throw error;
    }
  }

  async deleteBoard(boardId: string, userId: string) {
    await this.validateBoardOwner(boardId, userId);
    try {
      await this.boardsRepository.deleteBoard(boardId);
      return { message: "Board deleted successfully" };
    } catch (error: unknown) {
      this.throwIfBoardNotFound(error);
      throw error;
    }
  }

  async validateBoardAccess(boardId: string, userId: string) {
    const board = await this.boardsRepository.findById(boardId);
    if (!board) {
      throw new NotFoundException("Board not found");
    }

    const membership = await this.boardsRepository.findMembership(
      boardId,
      userId,
    );
    if (!membership) {
      throw new ForbiddenException("You are not a member of this board");
    }
    return board;
  }

  async validateBoardOwner(boardId: string, userId: string) {
    await this.validateBoardAccess(boardId, userId);
    const membership = await this.boardsRepository.findMembership(
      boardId,
      userId,
    );
    if (!membership || membership.role !== "OWNER") {
      throw new ForbiddenException(
        "Only the board owner can perform this action",
      );
    }
    return membership;
  }

  private throwIfBoardNotFound(error: unknown): void {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      throw new NotFoundException("Board not found");
    }
  }
}
