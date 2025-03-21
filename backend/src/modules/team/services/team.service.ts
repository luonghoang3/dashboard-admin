import { Injectable, NotFoundException, BadRequestException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like } from 'typeorm';
import { Team } from '../entities/team.entity';
import { User } from '../../user/entities/user.entity';
import { CreateTeamDto, UpdateTeamDto, QueryTeamDto } from '../dto';

@Injectable()
export class TeamService {
  private readonly logger = new Logger(TeamService.name);

  constructor(
    @InjectRepository(Team)
    private readonly teamRepository: Repository<Team>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async create(createTeamDto: CreateTeamDto): Promise<Team> {
    try {
      const team = this.teamRepository.create(createTeamDto);
      return await this.teamRepository.save(team);
    } catch (error) {
      this.logger.error(`Error creating team: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(queryParams: QueryTeamDto = {}): Promise<Team[]> {
    try {
      const { name, department, isActive } = queryParams;
      const whereCondition: any = {};

      if (name) {
        whereCondition.name = Like(`%${name}%`);
      }

      if (department) {
        whereCondition.department = Like(`%${department}%`);
      }

      if (isActive !== undefined) {
        whereCondition.isActive = isActive;
      }

      this.logger.log(`Finding all teams with conditions: ${JSON.stringify(whereCondition)}`);
      
      // Tránh sử dụng relations để khắc phục lỗi TypeORM
      return await this.teamRepository.find({
        where: whereCondition,
      });
    } catch (error) {
      this.logger.error(`Error finding teams: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findOne(id: string): Promise<Team> {
    try {
      // Tránh sử dụng relations cho findOne để tránh lỗi
      const team = await this.teamRepository.findOne({
        where: { id },
      });

      if (!team) {
        throw new NotFoundException(`Team with ID ${id} not found`);
      }

      return team;
    } catch (error) {
      this.logger.error(`Error finding team with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team> {
    try {
      const team = await this.findOne(id);
      
      // Update the team
      const updatedTeam = Object.assign(team, updateTeamDto);
      return await this.teamRepository.save(updatedTeam);
    } catch (error) {
      this.logger.error(`Error updating team with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const team = await this.findOne(id);
      await this.teamRepository.remove(team);
    } catch (error) {
      this.logger.error(`Error removing team with id ${id}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async addUserToTeam(teamId: string, userId: string): Promise<Team> {
    try {
      const team = await this.findOne(teamId);
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['teams'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Kiểm tra nếu user.teams là undefined, khởi tạo là mảng rỗng
      if (!user.teams) {
        user.teams = [];
      }

      // Check if user is already in the team
      const isUserInTeam = user.teams.some(t => t.id === teamId);
      if (isUserInTeam) {
        throw new BadRequestException(`User is already a member of this team`);
      }

      // Add team to user's teams
      user.teams.push(team);
      await this.userRepository.save(user);

      return this.findOne(teamId);
    } catch (error) {
      this.logger.error(`Error adding user ${userId} to team ${teamId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async removeUserFromTeam(teamId: string, userId: string): Promise<Team> {
    try {
      const team = await this.findOne(teamId);
      const user = await this.userRepository.findOne({
        where: { id: userId },
        relations: ['teams'],
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${userId} not found`);
      }

      // Kiểm tra nếu user.teams là undefined, khởi tạo là mảng rỗng
      if (!user.teams) {
        throw new BadRequestException(`User is not a member of this team`);
      }

      // Check if user is in the team
      const isUserInTeam = user.teams.some(t => t.id === teamId);
      if (!isUserInTeam) {
        throw new BadRequestException(`User is not a member of this team`);
      }

      // Remove team from user's teams
      user.teams = user.teams.filter(t => t.id !== teamId);
      await this.userRepository.save(user);

      return this.findOne(teamId);
    } catch (error) {
      this.logger.error(`Error removing user ${userId} from team ${teamId}: ${error.message}`, error.stack);
      throw error;
    }
  }

  async getUsersByTeam(teamId: string): Promise<User[]> {
    try {
      // Sử dụng cách tiếp cận khác để lấy users từ team
      // Truy vấn người dùng có liên kết với team này
      const users = await this.userRepository
        .createQueryBuilder('user')
        .innerJoin('user.teams', 'team')
        .where('team.id = :teamId', { teamId })
        .getMany();
      
      return users;
    } catch (error) {
      this.logger.error(`Error getting users for team ${teamId}: ${error.message}`, error.stack);
      throw error;
    }
  }
} 