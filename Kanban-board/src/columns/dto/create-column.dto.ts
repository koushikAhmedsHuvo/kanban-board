import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateColumnDto {
  @ApiProperty({ example: "Todo", minLength: 2, maxLength: 50 })
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @MinLength(2)
  @MaxLength(50)
  @IsNotEmpty()
  title!: string;
}
