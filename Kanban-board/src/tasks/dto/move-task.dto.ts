import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsUUID, Min } from "class-validator";

export class MoveTaskDto {
  @ApiProperty({
    example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a",
    format: "uuid",
  })
  @IsUUID()
  targetColumnId!: string;

  @ApiProperty({
    example: 1,
    minimum: 0,
    description:
      "Zero-based destination index; values after the last task append",
  })
  @IsInt()
  @Min(0)
  targetIndex!: number;
}
