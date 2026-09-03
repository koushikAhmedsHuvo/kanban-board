import { Module } from "@nestjs/common";
import { BoardsController } from "./boards.controller";
import { BoardsRepository } from "./boards.repository";
import { BoardsService } from "./boards.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [BoardsController],
  providers: [BoardsService, BoardsRepository],
  exports: [BoardsService, BoardsRepository],
})
export class BoardsModule {}
