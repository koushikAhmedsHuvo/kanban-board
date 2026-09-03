import { ApiProperty, ApiPropertyOptional } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
} from "class-validator";

export class CreateTaskDto {
  @ApiProperty({
    example: "Implement JWT Authentication",
    minLength: 2,
    maxLength: 200,
  })
  @IsString()
  @Transform(({ value }: { value: unknown }) =>
    typeof value === "string" ? value.trim() : value,
  )
  @MinLength(2)
  @MaxLength(200)
  @IsNotEmpty()
  title!: string;

  @ApiPropertyOptional({
    example: "Create login and registration APIs",
    maxLength: 5000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(5000)
  description?: string;
}
