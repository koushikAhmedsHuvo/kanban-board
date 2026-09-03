import { ApiProperty } from "@nestjs/swagger";
import { IsInt, IsPositive } from "class-validator";

export class MoveColumnDto {
  @ApiProperty({ example: 1500, type: Number, minimum: 1 })
  @IsInt()
  @IsPositive()
  targetPosition!: number;
}
