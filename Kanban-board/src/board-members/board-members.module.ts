import { Module } from "@nestjs/common";
import { BoardMembersController } from "./board-members.controller";
import { BoardMembersRepository } from "./board-members.repository";
import { BoardMembersService } from "./board-members.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [BoardMembersController],
  providers: [BoardMembersService, BoardMembersRepository],
  exports: [BoardMembersService, BoardMembersRepository],
})
export class BoardMembersModule {}
