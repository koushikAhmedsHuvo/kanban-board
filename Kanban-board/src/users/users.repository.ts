import { Injectable } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { PrismaService } from "../prisma/prisma.service";

export const publicUserSelect = {
  id: true,
  name: true,
  email: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect;

export type PublicUser = Prisma.UserGetPayload<{
  select: typeof publicUserSelect;
}>;

export const searchUserSelect = {
  id: true,
  name: true,
  email: true,
} satisfies Prisma.UserSelect;

@Injectable()
export class UsersRepository {
  constructor(private readonly prisma: PrismaService) {}

  findById(id: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { id },
      select: publicUserSelect,
    });
  }

  findByEmail(email: string): Promise<PublicUser | null> {
    return this.prisma.user.findUnique({
      where: { email },
      select: publicUserSelect,
    });
  }

  searchUsers(
    query: string,
  ): Promise<
    Array<Prisma.UserGetPayload<{ select: typeof searchUserSelect }>>
  > {
    return this.prisma.user.findMany({
      where: {
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { email: { contains: query, mode: "insensitive" } },
        ],
      },
      select: searchUserSelect,
      orderBy: { name: "asc" },
      take: 20,
    });
  }

  updateProfile(
    id: string,
    data: Pick<Prisma.UserUpdateInput, "name">,
  ): Promise<PublicUser> {
    return this.prisma.user.update({
      where: { id },
      data,
      select: publicUserSelect,
    });
  }
}
