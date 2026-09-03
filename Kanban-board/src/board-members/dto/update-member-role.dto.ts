import { ApiProperty } from "@nestjs/swagger";
import { BoardRole } from "@prisma/client";
import { IsEnum } from "class-validator";

export class UpdateMemberRoleDto {
  @ApiProperty({
    enum: [BoardRole.EDITOR, BoardRole.VIEWER],
    example: BoardRole.VIEWER,
  })
  @IsEnum([BoardRole.EDITOR, BoardRole.VIEWER])
  role!: BoardRole;
}
