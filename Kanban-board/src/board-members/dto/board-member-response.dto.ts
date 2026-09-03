import { ApiProperty } from "@nestjs/swagger";
import { BoardRole } from "@prisma/client";

export class MemberUserResponseDto {
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" })
  id!: string;
  @ApiProperty({ example: "Rahim" })
  name!: string;
  @ApiProperty({ example: "rahim@gmail.com" })
  email!: string;
}

export class BoardMemberResponseDto {
  @ApiProperty({ example: "b6f1c4b8-8b8c-4c18-8c18-3c5d1f7c0d2a" })
  id!: string;
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" })
  boardId!: string;
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" })
  userId!: string;
  @ApiProperty({ enum: BoardRole, example: BoardRole.EDITOR })
  role!: BoardRole;
  @ApiProperty({ type: MemberUserResponseDto })
  user!: MemberUserResponseDto;
  @ApiProperty({ example: "2026-09-03T10:00:00.000Z" })
  createdAt!: Date;
}

export class AvailableUserResponseDto extends MemberUserResponseDto {}

export class DeleteMemberResponseDto {
  @ApiProperty({ example: "Member removed successfully" })
  message!: string;
}
