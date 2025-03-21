import { Controller, Post, UseGuards, Request, Get, Body } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBody, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthService } from '../services/auth.service';
import { LoginDto } from '../dto/login.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Đăng nhập vào hệ thống' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 201,
    description: 'Đăng nhập thành công',
    type: AuthResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Không thể xác thực với thông tin đăng nhập đã cung cấp',
  })
  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req, @Body() loginDto: LoginDto): Promise<AuthResponseDto> {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'Lấy thông tin người dùng đã đăng nhập' })
  @ApiResponse({
    status: 200,
    description: 'Trả về thông tin người dùng hiện tại',
  })
  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
} 