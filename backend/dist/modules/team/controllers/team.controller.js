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
Object.defineProperty(exports, "__esModule", { value: true });
exports.TeamController = void 0;
const common_1 = require("@nestjs/common");
const team_service_1 = require("../services/team.service");
const dto_1 = require("../dto");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../../user/entities/user.entity");
let TeamController = class TeamController {
    constructor(teamService) {
        this.teamService = teamService;
    }
    async create(createTeamDto) {
        return this.teamService.create(createTeamDto);
    }
    async createTestTeam() {
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
        }
        catch (error) {
            return {
                message: 'Error creating test team',
                error: error.message
            };
        }
    }
    async findAll(query) {
        try {
            const teams = await this.teamService.findAll(query);
            return {
                success: true,
                data: teams
            };
        }
        catch (error) {
            return {
                success: false,
                error: error.message,
                stack: error.stack
            };
        }
    }
    async findAllPublic() {
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
    async healthCheck() {
        return {
            status: 'success',
            message: 'Team API is working',
            timestamp: new Date().toISOString()
        };
    }
    async findOne(id) {
        return this.teamService.findOne(id);
    }
    async update(id, updateTeamDto) {
        return this.teamService.update(id, updateTeamDto);
    }
    async remove(id) {
        return this.teamService.remove(id);
    }
    async addUserToTeam(teamId, addUserToTeamDto) {
        return this.teamService.addUserToTeam(teamId, addUserToTeamDto.userId);
    }
    async removeUserFromTeam(teamId, userId) {
        return this.teamService.removeUserFromTeam(teamId, userId);
    }
    async getUsersByTeam(teamId) {
        return this.teamService.getUsersByTeam(teamId);
    }
};
exports.TeamController = TeamController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.CreateTeamDto]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('test-team'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "createTestTeam", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [dto_1.QueryTeamDto]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)('test'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "findAllPublic", null);
__decorate([
    (0, common_1.Get)('health-check'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "healthCheck", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Patch)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.UpdateTeamDto]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, dto_1.AddUserToTeamDto]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "addUserToTeam", null);
__decorate([
    (0, common_1.Delete)(':id/users/:userId'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN, user_entity_1.UserRole.MANAGER),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "removeUserFromTeam", null);
__decorate([
    (0, common_1.Get)(':id/users'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], TeamController.prototype, "getUsersByTeam", null);
exports.TeamController = TeamController = __decorate([
    (0, common_1.Controller)('teams'),
    __metadata("design:paramtypes", [team_service_1.TeamService])
], TeamController);
//# sourceMappingURL=team.controller.js.map