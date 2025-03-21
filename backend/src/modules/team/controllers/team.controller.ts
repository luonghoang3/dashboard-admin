import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { TeamService } from '../services/team.service';
import { CreateTeamDto, UpdateTeamDto, AddUserToTeamDto, QueryTeamDto } from '../dto';
import { Team } from '../entities/team.entity';
import { User } from '../../user/entities/user.entity';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../auth/guards/roles.guard';
import { Roles } from '../../auth/decorators/roles.decorator';
import { UserRole } from '../../user/entities/user.entity';

@Controller('teams')
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async create(@Body() createTeamDto: CreateTeamDto): Promise<Team> {
    return this.teamService.create(createTeamDto);
  }

  @Post('test-team')
  async createTestTeam(): Promise<any> {
    try {
      const testTeam = {
        name: 'Test Team',
        description: 'A team for testing purposes',
        department: 'Testing',
        isActive: true
      };
      
      const team = await this.teamService.create(testTeam);
      return {
        message: 'Test team created successfully',
        team: team
      };
    } catch (error) {
      return {
        message: 'Error creating test team',
        error: error.message
      };
    }
  }

  @Get()
  // Tạm thời bỏ các guard để debug
  //@UseGuards(JwtAuthGuard, RolesGuard)
  async findAll(@Query() query: QueryTeamDto): Promise<any> {
    try {
      const teams = await this.teamService.findAll(query);
      return {
        success: true,
        data: teams
      };
    } catch (error) {
      return {
        success: false,
        error: error.message,
        stack: error.stack
      };
    }
  }

  @Get('test')
  async findAllPublic(): Promise<any> {
    return {
      message: 'Teams retrieved successfully',
      teams: [
        {
          id: 'test-team-1',
          name: 'Mock Development Team',
          description: 'This is a mock team for testing',
          department: 'Engineering',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          users: []
        },
        {
          id: 'test-team-2',
          name: 'Mock Marketing Team',
          description: 'This is a mock team for testing',
          department: 'Marketing',
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          users: []
        }
      ]
    };
  }

  @Get('health-check')
  async healthCheck(): Promise<any> {
    return {
      status: 'success',
      message: 'Team API is working',
      timestamp: new Date().toISOString()
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async findOne(@Param('id') id: string): Promise<Team> {
    return this.teamService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async update(
    @Param('id') id: string,
    @Body() updateTeamDto: UpdateTeamDto,
  ): Promise<Team> {
    return this.teamService.update(id, updateTeamDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async remove(@Param('id') id: string): Promise<void> {
    return this.teamService.remove(id);
  }

  @Post(':id/users')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async addUserToTeam(
    @Param('id') teamId: string,
    @Body() addUserToTeamDto: AddUserToTeamDto,
  ): Promise<Team> {
    return this.teamService.addUserToTeam(teamId, addUserToTeamDto.userId);
  }

  @Delete(':id/users/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.MANAGER)
  async removeUserFromTeam(
    @Param('id') teamId: string,
    @Param('userId') userId: string,
  ): Promise<Team> {
    return this.teamService.removeUserFromTeam(teamId, userId);
  }

  @Get(':id/users')
  @UseGuards(JwtAuthGuard)
  async getUsersByTeam(@Param('id') teamId: string): Promise<User[]> {
    return this.teamService.getUsersByTeam(teamId);
  }
} 