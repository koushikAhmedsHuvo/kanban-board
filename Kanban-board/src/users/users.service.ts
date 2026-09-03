import { Injectable, NotFoundException } from "@nestjs/common";
import { Prisma } from "@prisma/client";
import { UpdateProfileDto } from "./dto/update-profile.dto";
import { UsersRepository } from "./users.repository";

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getCurrentUser(userId: string) {
    return this.getUserById(userId);
  }

  async getUserById(userId: string) {
    const user = await this.usersRepository.findById(userId);
    if (!user) {
      throw new NotFoundException("User not found");
    }
    return user;
  }

  searchUsers(query: string) {
    return this.usersRepository.searchUsers(query.trim());
  }

  async updateProfile(userId: string, updateProfileDto: UpdateProfileDto) {
    try {
      return await this.usersRepository.updateProfile(userId, {
        name: updateProfileDto.name,
      });
    } catch (error: unknown) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === "P2025"
      ) {
        throw new NotFoundException("User not found");
      }
      throw error;
    }
  }
}
