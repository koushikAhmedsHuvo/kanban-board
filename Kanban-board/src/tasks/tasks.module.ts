import { Module } from "@nestjs/common";
import { TasksController } from "./tasks.controller";
import { TasksRepository } from "./tasks.repository";
import { TaskMoveRepository } from "./repositories/task-move.repository";
import { TaskMoveService } from "./services/task-move.service";
import { TasksService } from "./tasks.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [TasksController],
  providers: [
    TasksService,
    TasksRepository,
    TaskMoveRepository,
    TaskMoveService,
  ],
  exports: [TasksService, TasksRepository],
})
export class TasksModule {}
