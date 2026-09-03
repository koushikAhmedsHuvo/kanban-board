import { Injectable } from "@nestjs/common";
import { BoardRole, Prisma } from "@prisma/client";
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from "@nestjs/common";
import { AddMemberDto } from "./dto/add-member.dto";
import { SearchAvailableUsersDto } from "./dto/search-available-users.dto";
import { UpdateMemberRoleDto } from "./dto/update-member-role.dto";
import { BoardMembersRepository } from "./board-members.repository";

@Injectable()
export class BoardMembersService {
  constructor(
    private readonly boardMembersRepository: BoardMembersRepository,
  ) {}

  async addMember(boardId: string, actorId: string, dto: AddMemberDto) {
    await this.validateBoardOwner(boardId, actorId);
    if (dto.role === BoardRole.OWNER) {
      throw new ForbiddenException(
        "OWNER role can only be assigned during board creation",
      );
    }
    if (!(await this.boardMembersRepository.findUserById(dto.userId))) {
      throw new NotFoundException("User not found");
    }
    if (await this.boardMembersRepository.findMembership(boardId, dto.userId)) {
      throw new ConflictException("User is already a member of this board");
    }
    try {
      return await this.boardMembersRepository.createMembership(
        boardId,
        dto.userId,
        dto.role,
      );
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2002"
      ) {
        throw new ConflictException("User is already a member of this board");
      }
      throw error;
    }
  }

  async getBoardMembers(boardId: string, userId: string) {
    await this.validateBoardMembership(boardId, userId);
    return this.boardMembersRepository.findBoardMembers(boardId);
  }

  async updateMemberRole(
    boardId: string,
    memberId: string,
    actorId: string,
    dto: UpdateMemberRoleDto,
  ) {
    await this.validateBoardOwner(boardId, actorId);
    const membership = await this.getTargetMembership(boardId, memberId);
    if (membership.role === BoardRole.OWNER) {
      throw new ForbiddenException("The board owner role cannot be modified");
    }
    return this.boardMembersRepository.updateRole(boardId, memberId, dto.role);
  }

  async removeMember(boardId: string, memberId: string, actorId: string) {
    await this.validateBoardOwner(boardId, actorId);
    const membership = await this.getTargetMembership(boardId, memberId);
    if (membership.role === BoardRole.OWNER) {
      throw new ForbiddenException("The board owner cannot be removed");
    }
    await this.boardMembersRepository.deleteMembership(boardId, memberId);
    return { message: "Member removed successfully" };
  }

  async searchAvailableUsers(
    boardId: string,
    userId: string,
    dto: SearchAvailableUsersDto,
  ) {
    await this.validateBoardMembership(boardId, userId);
    return this.boardMembersRepository.searchAvailableUsers(
      boardId,
      dto.q.trim(),
    );
  }

  async validateBoardMembership(boardId: string, userId: string) {
    const membership = await this.getMembership(boardId, userId);
    if (!membership) {
      const board = await this.boardMembersRepository.findBoardOwner(boardId);
      if (!board) {
        throw new NotFoundException("Board not found");
      }
      throw new ForbiddenException("You are not a member of this board");
    }
    return membership;
  }

  async validateBoardOwner(boardId: string, userId: string) {
    const membership = await this.validateBoardMembership(boardId, userId);
    if (membership.role !== BoardRole.OWNER) {
      throw new ForbiddenException(
        "Only the board owner can perform this action",
      );
    }
    return membership;
  }

  getMembership(boardId: string, userId: string) {
    return this.boardMembersRepository.findMembership(boardId, userId);
  }

  private async getTargetMembership(boardId: string, memberId: string) {
    const membership = await this.boardMembersRepository.findMembershipById(
      boardId,
      memberId,
    );
    if (!membership) {
      throw new NotFoundException("Membership not found");
    }
    return membership;
  }
}
