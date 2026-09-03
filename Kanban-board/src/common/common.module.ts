import { Global, Module } from "@nestjs/common";
import { PrismaModule } from "../prisma/prisma.module";
import { BoardAccessGuard } from "./guards/board-access.guard";
import { BoardPermissionGuard } from "./guards/board-permission.guard";
import { PermissionService } from "./services/permission.service";

@Global()
@Module({
  imports: [PrismaModule],
  providers: [PermissionService, BoardAccessGuard, BoardPermissionGuard],
  exports: [PermissionService, BoardAccessGuard, BoardPermissionGuard],
})
export class CommonModule {}
