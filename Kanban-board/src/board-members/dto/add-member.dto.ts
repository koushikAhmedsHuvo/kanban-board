import { ApiProperty } from "@nestjs/swagger";
import { BoardRole } from "@prisma/client";
import { IsEnum, IsUUID } from "class-validator";

export class AddMemberDto {
  @ApiProperty({
    example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a",
    format: "uuid",
  })
  @IsUUID()
  userId!: string;

  @ApiProperty({
    enum: [BoardRole.EDITOR, BoardRole.VIEWER],
    example: BoardRole.EDITOR,
  })
  @IsEnum([BoardRole.EDITOR, BoardRole.VIEWER])
  role!: BoardRole;
}
