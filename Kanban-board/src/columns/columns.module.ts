import { Module } from "@nestjs/common";
import { ColumnsController } from "./columns.controller";
import { ColumnsRepository } from "./columns.repository";
import { ColumnsService } from "./columns.service";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
  imports: [PrismaModule],
  controllers: [ColumnsController],
  providers: [ColumnsService, ColumnsRepository],
  exports: [ColumnsService, ColumnsRepository],
})
export class ColumnsModule {}
