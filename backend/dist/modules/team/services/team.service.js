"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var TeamService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const team_entity_1 = require("../entities/team.entity");
const user_entity_1 = require("../../user/entities/user.entity");
let TeamService = TeamService_1 = class TeamService {
    constructor(teamRepository, userRepository) {
        this.teamRepository = teamRepository;
        this.userRepository = userRepository;
        this.logger = new common_1.Logger(TeamService_1.name);
    }
    async create(createTeamDto) {
        try {
            const team = this.teamRepository.create(createTeamDto);
            return await this.teamRepository.save(team);
        }
        catch (error) {
            this.logger.error(`Error creating team: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findAll(queryParams = {}) {
        try {
            const { name, department, isActive } = queryParams;
            const whereCondition = {};
            if (name) {
                whereCondition.name = (0, typeorm_2.Like)(`%${name}%`);
            }
            if (department) {
                whereCondition.department = (0, typeorm_2.Like)(`%${department}%`);
            }
            if (isActive !== undefined) {
                whereCondition.isActive = isActive;
            }
            this.logger.log(`Finding all teams with conditions: ${JSON.stringify(whereCondition)}`);
            return await this.teamRepository.find({
                where: whereCondition,
            });
        }
        catch (error) {
            this.logger.error(`Error finding teams: ${error.message}`, error.stack);
            throw error;
        }
    }
    async findOne(id) {
        try {
            const team = await this.teamRepository.findOne({
                where: { id },
            });
            if (!team) {
                throw new common_1.NotFoundException(`Team with ID ${id} not found`);
            }
            return team;
        }
        catch (error) {
            this.logger.error(`Error finding team with id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async update(id, updateTeamDto) {
        try {
            const team = await this.findOne(id);
            const updatedTeam = Object.assign(team, updateTeamDto);
            return await this.teamRepository.save(updatedTeam);
        }
        catch (error) {
            this.logger.error(`Error updating team with id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async remove(id) {
        try {
            const team = await this.findOne(id);
            await this.teamRepository.remove(team);
        }
        catch (error) {
            this.logger.error(`Error removing team with id ${id}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async addUserToTeam(teamId, userId) {
        try {
            const team = await this.findOne(teamId);
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['teams'],
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${userId} not found`);
            }
            if (!user.teams) {
                user.teams = [];
            }
            const isUserInTeam = user.teams.some(t => t.id === teamId);
            if (isUserInTeam) {
                throw new common_1.BadRequestException(`User is already a member of this team`);
            }
            user.teams.push(team);
            await this.userRepository.save(user);
            return this.findOne(teamId);
        }
        catch (error) {
            this.logger.error(`Error adding user ${userId} to team ${teamId}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async removeUserFromTeam(teamId, userId) {
        try {
            const team = await this.findOne(teamId);
            const user = await this.userRepository.findOne({
                where: { id: userId },
                relations: ['teams'],
            });
            if (!user) {
                throw new common_1.NotFoundException(`User with ID ${userId} not found`);
            }
            if (!user.teams) {
                throw new common_1.BadRequestException(`User is not a member of this team`);
            }
            const isUserInTeam = user.teams.some(t => t.id === teamId);
            if (!isUserInTeam) {
                throw new common_1.BadRequestException(`User is not a member of this team`);
            }
            user.teams = user.teams.filter(t => t.id !== teamId);
            await this.userRepository.save(user);
            return this.findOne(teamId);
        }
        catch (error) {
            this.logger.error(`Error removing user ${userId} from team ${teamId}: ${error.message}`, error.stack);
            throw error;
        }
    }
    async getUsersByTeam(teamId) {
        try {
            const users = await this.userRepository
                .createQueryBuilder('user')
                .innerJoin('user.teams', 'team')
                .where('team.id = :teamId', { teamId })
                .getMany();
            return users;
        }
        catch (error) {
            this.logger.error(`Error getting users for team ${teamId}: ${error.message}`, error.stack);
            throw error;
        }
    }
};
exports.TeamService = TeamService;
exports.TeamService = TeamService = TeamService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(team_entity_1.Team)),
    __param(1, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], TeamService);
//# sourceMappingURL=team.service.js.map