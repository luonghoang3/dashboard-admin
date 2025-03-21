import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'user123', description: 'Tên đăng nhập', required: false })
  @IsOptional()
  @IsString({ message: 'Tên đăng nhập phải là chuỗi' })
  username?: string;

  @ApiProperty({ example: 'user@example.com', description: 'Email', required: false })
  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @ApiProperty({ example: 'newpassword123', description: 'Mật khẩu', required: false })
  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password?: string;

  @ApiProperty({ example: 'New User Name', description: 'Tên đầy đủ', required: false })
  @IsOptional()
  @IsString({ message: 'Tên đầy đủ phải là chuỗi' })
  fullName?: string;

  @ApiProperty({ example: 'user', description: 'Vai trò', enum: ['admin', 'user'], required: false })
  @IsOptional()
  @IsString({ message: 'Vai trò phải là chuỗi' })
  role?: string;

  @ApiProperty({ example: 'https://example.com/new-avatar.jpg', description: 'URL avatar', required: false })
  @IsOptional()
  @IsString({ message: 'Avatar phải là chuỗi' })
  avatar?: string;

  @ApiProperty({ example: true, description: 'Trạng thái hoạt động', required: false })
  @IsOptional()
  isActive?: boolean;
} 