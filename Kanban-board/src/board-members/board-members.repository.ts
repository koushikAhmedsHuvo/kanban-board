import { Injectable } from "@nestjs/common";
import { BoardRole, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const membershipSelect = {
  id: true,
  boardId: true,
  userId: true,
  role: true,
  createdAt: true,
  user: { select: { id: true, name: true, email: true } },
} satisfies Prisma.BoardMemberSelect;

export type MembershipWithUser = Prisma.BoardMemberGetPayload<{
  select: typeof membershipSelect;
}>;

const availableUserSelect = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect;

export type AvailableUser = Prisma.UserGetPayload<{
  select: typeof availableUserSelect;
}>;

@Injectable()
export class BoardMembersRepository {
  constructor(private readonly prisma: PrismaService) {}

  createMembership(
    boardId: string,
    userId: string,
    role: BoardRole,
  ): Promise<MembershipWithUser> {
    return this.prisma.boardMember.create({
      data: { boardId, userId, role },
      select: membershipSelect,
    });
  }

  findMembership(
    boardId: string,
    userId: string,
  ): Promise<MembershipWithUser | null> {
    return this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
      select: membershipSelect,
    });
  }

  findMembershipById(
    boardId: string,
    memberId: string,
  ): Promise<MembershipWithUser | null> {
    return this.prisma.boardMember.findFirst({
      where: { id: memberId, boardId },
      select: membershipSelect,
    });
  }

  findBoardMembers(boardId: string): Promise<MembershipWithUser[]> {
    return this.prisma.boardMember.findMany({
      where: { boardId },
      select: membershipSelect,
      orderBy: [{ role: "asc" }, { createdAt: "asc" }],
    });
  }

  findBoardOwner(boardId: string) {
    return this.prisma.board.findUnique({
      where: { id: boardId },
      select: { ownerId: true },
    });
  }

  findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
  }

  updateRole(
    boardId: string,
    memberId: string,
    role: BoardRole,
  ): Promise<MembershipWithUser> {
    return this.prisma.boardMember
      .updateMany({
        where: { id: memberId, boardId },
        data: { role },
      })
      .then(async () => {
        const membership = await this.findMembershipById(boardId, memberId);
        if (!membership) {
          throw new Prisma.PrismaClientKnownRequestError(
            "Membership not found",
            {
              code: "P2025",
              clientVersion: Prisma.prismaVersion.client,
            },
          );
        }
        return membership;
      });
  }

  deleteMembership(boardId: string, memberId: string): Promise<void> {
    return this.prisma.boardMember
      .deleteMany({ where: { id: memberId, boardId } })
      .then(() => undefined);
  }

  searchAvailableUsers(
    boardId: string,
    query: string,
  ): Promise<AvailableUser[]> {
    return this.prisma.user.findMany({
      where: {
        AND: [
          {
            OR: [
              { name: { contains: query, mode: "insensitive" } },
              { email: { contains: query, mode: "insensitive" } },
            ],
          },
          { memberships: { none: { boardId } } },
        ],
      },
      select: availableUserSelect,
      orderBy: { name: "asc" },
      take: 20,
    });
  }
}
