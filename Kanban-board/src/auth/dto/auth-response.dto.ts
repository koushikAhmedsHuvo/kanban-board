import { ApiProperty } from '@nestjs/swagger';

export class PublicUserResponseDto {
  @ApiProperty({ example: '4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a' })
  id!: string;

  @ApiProperty({ example: 'John Doe' })
  name!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;

  @ApiProperty({ example: '2026-09-03T10:00:00.000Z' })
  createdAt!: Date;

  @ApiProperty({ example: '2026-09-03T10:00:00.000Z' })
  updatedAt!: Date;
}

export class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  accessToken!: string;

  @ApiProperty({ type: PublicUserResponseDto })
  user!: PublicUserResponseDto;
}

export class AuthenticatedUserResponseDto {
  @ApiProperty({ example: '4c3c1f72-8cc1-4b8b-8c18-3c5d1f7c0d2a' })
  sub!: string;

  @ApiProperty({ example: 'john.doe@example.com' })
  email!: string;
}
