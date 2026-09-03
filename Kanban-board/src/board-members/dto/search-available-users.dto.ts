import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SearchAvailableUsersDto {
  @ApiProperty({ example: "rahim", minLength: 1 })
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @MinLength(1)
  @IsNotEmpty()
  q!: string;
}
