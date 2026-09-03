import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";

export class TaskColumnResponseDto {
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" }) id!: string;
  @ApiProperty({ example: "Todo" }) title!: string;
}

export class TaskCreatorResponseDto {
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" }) id!: string;
  @ApiProperty({ example: "Koushik Ahmed" }) name!: string;
}

export class TaskResponseDto {
  @ApiProperty({ example: "b6f1c4b8-8b8c-4c18-8c18-3c5d1f7c0d2a" }) id!: string;
  @ApiProperty({ example: "Implement JWT Authentication" }) title!: string;
  @ApiPropertyOptional({
    example: "Create login and registration APIs",
    nullable: true,
  })
  description?: string | null;
  @ApiProperty({ example: 1000 }) position!: number;
}

export class TaskDetailsResponseDto extends TaskResponseDto {
  @ApiProperty({ type: TaskColumnResponseDto }) column!: TaskColumnResponseDto;
  @ApiProperty({ type: TaskCreatorResponseDto, nullable: true })
  createdBy!: TaskCreatorResponseDto | null;
}

export class TaskActionResponseDto {
  @ApiProperty({ example: "Task moved successfully" }) message!: string;
}

export class DeleteTaskResponseDto {
  @ApiProperty({ example: "Task deleted successfully" }) message!: string;
}
