import { Injectable } from "@nestjs/common";
import { BoardRole, Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const boardSelect = {
  id: true,
  name: true,
  owner: { select: { id: true, name: true } },
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.BoardSelect;

export const boardDetailsSelect = {
  ...boardSelect,
  _count: { select: { members: true, columns: true } },
} satisfies Prisma.BoardSelect;

export const membershipSelect = {
  boardId: true,
  userId: true,
  role: true,
} satisfies Prisma.BoardMemberSelect;

export type BoardSummary = Prisma.BoardGetPayload<{
  select: typeof boardSelect;
}> & {
  role: BoardRole;
};
export type BoardDetails = Prisma.BoardGetPayload<{
  select: typeof boardDetailsSelect;
}>;
export type BoardMembership = Prisma.BoardMemberGetPayload<{
  select: typeof membershipSelect;
}>;

@Injectable()
export class BoardsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createBoard(name: string, ownerId: string) {
    return this.prisma.$transaction(async (tx) => {
      const board = await tx.board.create({
        data: { name, ownerId },
        select: boardSelect,
      });

      await tx.boardMember.create({
        data: { boardId: board.id, userId: ownerId, role: BoardRole.OWNER },
      });

      return board;
    });
  }

  findById(id: string): Promise<BoardDetails | null> {
    return this.prisma.board.findUnique({
      where: { id },
      select: boardDetailsSelect,
    });
  }

  findUserBoards(userId: string): Promise<BoardSummary[]> {
    return this.prisma.boardMember
      .findMany({
        where: { userId },
        select: { role: true, board: { select: boardSelect } },
        orderBy: { board: { updatedAt: "desc" } },
      })
      .then((memberships) =>
        memberships.map(({ role, board }) => ({ ...board, role })),
      );
  }

  findMembership(
    boardId: string,
    userId: string,
  ): Promise<BoardMembership | null> {
    return this.prisma.boardMember.findUnique({
      where: { boardId_userId: { boardId, userId } },
      select: membershipSelect,
    });
  }

  updateBoard(id: string, data: Pick<Prisma.BoardUpdateInput, "name">) {
    return this.prisma.board.update({
      where: { id },
      data,
      select: boardSelect,
    });
  }

  deleteBoard(id: string): Promise<void> {
    return this.prisma.board.delete({ where: { id } }).then(() => undefined);
  }
}
