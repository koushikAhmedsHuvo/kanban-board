import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { BoardRole } from "@prisma/client";

export class BoardOwnerDto {
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" })
  id!: string;

  @ApiProperty({ example: "Koushik Ahmed" })
  name!: string;
}

export class BoardResponseDto {
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" })
  id!: string;

  @ApiProperty({ example: "ERP Project" })
  name!: string;

  @ApiPropertyOptional({ enum: BoardRole, example: BoardRole.OWNER })
  role?: BoardRole;

  @ApiProperty({ type: BoardOwnerDto })
  owner!: BoardOwnerDto;

  @ApiProperty({ example: "2026-09-03T10:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-09-03T10:00:00.000Z" })
  updatedAt!: Date;
}

export class BoardDetailsResponseDto extends BoardResponseDto {
  @ApiProperty({ example: 3 })
  memberCount!: number;

  @ApiProperty({ example: 4 })
  columnCount!: number;
}

export class DeleteBoardResponseDto {
  @ApiProperty({ example: "Board deleted successfully" })
  message!: string;
}
