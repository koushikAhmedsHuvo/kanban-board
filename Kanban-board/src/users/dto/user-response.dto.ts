import { ApiProperty } from "@nestjs/swagger";

export class UserProfileResponseDto {
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" })
  id!: string;

  @ApiProperty({ example: "Koushik Ahmed" })
  name!: string;

  @ApiProperty({ example: "koushik@gmail.com" })
  email!: string;

  @ApiProperty({ example: "2026-09-03T10:00:00.000Z" })
  createdAt!: Date;

  @ApiProperty({ example: "2026-09-03T10:00:00.000Z" })
  updatedAt!: Date;
}

export class UserSearchResultDto {
  @ApiProperty({ example: "4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a" })
  id!: string;

  @ApiProperty({ example: "Rahim" })
  name!: string;

  @ApiProperty({ example: "rahim@gmail.com" })
  email!: string;
}
