import { ApiProperty } from '@nestjs/swagger';
import { User } from '../../user/entities/user.entity';

export class AuthResponseDto {
  @ApiProperty({
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
    description: 'JWT access token',
  })
  accessToken: string;

  @ApiProperty({
    example: {
      id: '550e8400-e29b-41d4-a716-446655440000',
      username: 'admin',
      email: 'admin@example.com',
      fullName: 'Admin User',
      role: 'admin',
    },
    description: 'Thông tin người dùng đã đăng nhập',
  })
  user: Partial<User>;
} 