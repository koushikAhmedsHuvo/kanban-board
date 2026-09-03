import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class CreateBoardDto {
  @ApiProperty({ example: "ERP Project", minLength: 3, maxLength: 100 })
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @MinLength(3)
  @MaxLength(100)
  @IsNotEmpty()
  name!: string;
}
