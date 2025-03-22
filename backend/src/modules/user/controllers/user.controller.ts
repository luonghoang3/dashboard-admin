import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  Query,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../entities/user.entity';
import { AssignTeamDto } from '../dto/assign-team.dto';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin profile của người dùng hiện tại' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin profile thành công' })
  @ApiBearerAuth()
  async getProfile(@Request() req) {
    return this.userService.findById(req.user.id);
  }

  @Get('profile/with-teams')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin profile người dùng hiện tại kèm theo teams' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin profile và teams thành công' })
  @ApiBearerAuth()
  async getProfileWithTeams(@Request() req) {
    return this.userService.findByIdWithTeams(req.user.id);
  }

  @Get(':id/with-teams')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin người dùng kèm theo teams' })
  @ApiResponse({ status: 200, description: 'Trả về thông tin người dùng và teams thành công' })
  @ApiBearerAuth()
  findOneWithTeams(@Param('id') id: string) {
    return this.userService.findByIdWithTeams(id);
  }

  @Post(':id/teams')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Gán người dùng vào team' })
  @ApiResponse({ status: 200, description: 'Người dùng đã được gán vào team' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng hoặc team' })
  @ApiBearerAuth()
  assignToTeam(@Param('id') id: string, @Body() assignTeamDto: AssignTeamDto) {
    return this.userService.assignToTeam(id, assignTeamDto.teamId);
  }

  @Delete(':id/teams/:teamId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Xóa người dùng khỏi team' })
  @ApiResponse({ status: 200, description: 'Người dùng đã được xóa khỏi team' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng hoặc team' })
  @ApiBearerAuth()
  removeFromTeam(@Param('id') id: string, @Param('teamId') teamId: string) {
    return this.userService.removeFromTeam(id, teamId);
  }

  @Get('by-team/:teamId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách người dùng trong team' })
  @ApiResponse({ status: 200, description: 'Trả về danh sách người dùng thành công' })
  @ApiBearerAuth()
  getUsersByTeam(@Param('teamId') teamId: string) {
    return this.userService.findByTeamId(teamId);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Tạo người dùng mới' })
  @ApiResponse({ status: 201, description: 'Người dùng đã được tạo' })
  @ApiResponse({ status: 409, description: 'Tên đăng nhập hoặc email đã tồn tại' })
  @ApiBearerAuth()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('seed-test-admin')
  @ApiOperation({ summary: 'Tạo người dùng admin cho mục đích test (KHÔNG YÊU CẦU XÁC THỰC)' })
  @ApiResponse({ status: 201, description: 'Admin user đã được tạo' })
  async createTestAdmin() {
    const testAdmin = {
      username: 'testadmin',
      password: 'Test@123',
      email: 'testadmin@example.com',
      fullName: 'Test Admin',
      role: UserRole.ADMIN,
    };
    
    try {
      const user = await this.userService.create(testAdmin);
      return { 
        message: 'Admin test user created successfully',
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          fullName: user.fullName,
          role: user.role
        },
        loginInfo: {
          username: testAdmin.username,
          password: 'Test@123'
        }
      };
    } catch (error) {
      if (error.code === '23505') { // Duplicate key error
        return { 
          message: 'Admin test user already exists',
          loginInfo: {
            username: testAdmin.username,
            password: 'Test@123'
          }
        };
      }
      throw error;
    }
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy danh sách tất cả người dùng' })
  @ApiResponse({ status: 200, description: 'Lấy danh sách thành công' })
  @ApiBearerAuth()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Lấy thông tin người dùng theo ID' })
  @ApiResponse({ status: 200, description: 'Người dùng được tìm thấy' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @ApiBearerAuth()
  findOne(@Param('id') id: string) {
    return this.userService.findById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Cập nhật thông tin người dùng' })
  @ApiResponse({ status: 200, description: 'Người dùng đã được cập nhật' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @ApiBearerAuth()
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Xóa người dùng' })
  @ApiResponse({ status: 200, description: 'Người dùng đã được xóa' })
  @ApiResponse({ status: 404, description: 'Không tìm thấy người dùng' })
  @ApiBearerAuth()
  remove(@Param('id') id: string) {
    return this.userService.remove(id);
  }
} 