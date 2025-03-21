import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({ example: 'admin', description: 'Tên đăng nhập' })
  @IsNotEmpty({ message: 'Tên đăng nhập không được để trống' })
  @IsString({ message: 'Tên đăng nhập phải là chuỗi' })
  username: string;

  @ApiProperty({ example: 'admin@example.com', description: 'Email' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email: string;

  @ApiProperty({ example: 'password123', description: 'Mật khẩu' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password: string;

  @ApiProperty({ example: 'Admin User', description: 'Tên đầy đủ' })
  @IsNotEmpty({ message: 'Tên đầy đủ không được để trống' })
  @IsString({ message: 'Tên đầy đủ phải là chuỗi' })
  fullName: string;

  @ApiProperty({ example: 'admin', description: 'Vai trò', enum: ['admin', 'user'] })
  @IsNotEmpty({ message: 'Vai trò không được để trống' })
  @IsString({ message: 'Vai trò phải là chuỗi' })
  role: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg', description: 'URL avatar', required: false })
  @IsOptional()
  @IsString({ message: 'Avatar phải là chuỗi' })
  avatar?: string;
} 