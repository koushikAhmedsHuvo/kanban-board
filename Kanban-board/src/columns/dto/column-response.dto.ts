import { ApiProperty } from "@nestjs/swagger";

export class ColumnBoardResponseDto {
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" })
  id!: string;
  @ApiProperty({ example: "ERP Project" })
  name!: string;
}

export class ColumnResponseDto {
  @ApiProperty({ example: "b6f1c4b8-8b8c-4c18-8c18-3c5d1f7c0d2a" })
  id!: string;
  @ApiProperty({ example: "Todo" })
  title!: string;
  @ApiProperty({ example: 1000 })
  position!: number;
  @ApiProperty({ example: 5 })
  taskCount!: number;
}

export class ColumnDetailsResponseDto extends ColumnResponseDto {
  @ApiProperty({ type: ColumnBoardResponseDto })
  board!: ColumnBoardResponseDto;
  @ApiProperty({ example: "2026-09-03T10:00:00.000Z" })
  createdAt!: Date;
  @ApiProperty({ example: "2026-09-03T10:00:00.000Z" })
  updatedAt!: Date;
}

export class MoveColumnResponseDto {
  @ApiProperty({ example: "Column moved successfully" })
  message!: string;
}

export class DeleteColumnResponseDto {
  @ApiProperty({ example: "Column deleted successfully" })
  message!: string;
}
