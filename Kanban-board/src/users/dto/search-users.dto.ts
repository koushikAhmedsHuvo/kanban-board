import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsString, MinLength } from "class-validator";

export class SearchUsersDto {
  @ApiProperty({
    example: "rahim",
    minLength: 1,
    description: "Case-insensitive name or email search term",
  })
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @MinLength(1)
  @IsNotEmpty()
  q!: string;
}
