import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';

export class AuthEntity {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'user@example.com',
      name: 'John Doe',
      role: 'USER',
    },
    description: 'User information',
  })
  user: {
    id: string;
    email: string;
    name: string | null;
    role: Role;
  };
}
