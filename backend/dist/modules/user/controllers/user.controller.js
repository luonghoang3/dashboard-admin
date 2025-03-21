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
exports.UserController = void 0;
const common_1 = require("@nestjs/common");
const swagger_1 = require("@nestjs/swagger");
const jwt_auth_guard_1 = require("../../auth/guards/jwt-auth.guard");
const roles_guard_1 = require("../../auth/guards/roles.guard");
const user_service_1 = require("../services/user.service");
const create_user_dto_1 = require("../dto/create-user.dto");
const update_user_dto_1 = require("../dto/update-user.dto");
const roles_decorator_1 = require("../../auth/decorators/roles.decorator");
const user_entity_1 = require("../entities/user.entity");
let UserController = class UserController {
    constructor(userService) {
        this.userService = userService;
    }
    create(createUserDto) {
        return this.userService.create(createUserDto);
    }
    async createTestAdmin() {
        const testAdmin = {
            username: 'testadmin',
            password: 'Test@123',
            email: 'testadmin@example.com',
            fullName: 'Test Admin',
            role: user_entity_1.UserRole.ADMIN,
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
        }
        catch (error) {
            if (error.code === '23505') {
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
    findAll() {
        return this.userService.findAll();
    }
    findOne(id) {
        return this.userService.findById(id);
    }
    update(id, updateUserDto) {
        return this.userService.update(id, updateUserDto);
    }
    remove(id) {
        return this.userService.remove(id);
    }
};
exports.UserController = UserController;
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo người dùng mới' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Người dùng đã được tạo' }),
    (0, swagger_1.ApiResponse)({ status: 409, description: 'Tên đăng nhập hoặc email đã tồn tại' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [create_user_dto_1.CreateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "create", null);
__decorate([
    (0, common_1.Post)('seed-test-admin'),
    (0, swagger_1.ApiOperation)({ summary: 'Tạo người dùng admin cho mục đích test (KHÔNG YÊU CẦU XÁC THỰC)' }),
    (0, swagger_1.ApiResponse)({ status: 201, description: 'Admin user đã được tạo' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "createTestAdmin", null);
__decorate([
    (0, common_1.Get)(),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy danh sách tất cả người dùng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Lấy danh sách thành công' }),
    (0, swagger_1.ApiBearerAuth)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard),
    (0, swagger_1.ApiOperation)({ summary: 'Lấy thông tin người dùng theo ID' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Người dùng được tìm thấy' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy người dùng' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "findOne", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Cập nhật thông tin người dùng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Người dùng đã được cập nhật' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy người dùng' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, update_user_dto_1.UpdateUserDto]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, common_1.UseGuards)(jwt_auth_guard_1.JwtAuthGuard, roles_guard_1.RolesGuard),
    (0, roles_decorator_1.Roles)(user_entity_1.UserRole.ADMIN),
    (0, swagger_1.ApiOperation)({ summary: 'Xóa người dùng' }),
    (0, swagger_1.ApiResponse)({ status: 200, description: 'Người dùng đã được xóa' }),
    (0, swagger_1.ApiResponse)({ status: 404, description: 'Không tìm thấy người dùng' }),
    (0, swagger_1.ApiBearerAuth)(),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], UserController.prototype, "remove", null);
exports.UserController = UserController = __decorate([
    (0, swagger_1.ApiTags)('users'),
    (0, common_1.Controller)('users'),
    __metadata("design:paramtypes", [user_service_1.UserService])
], UserController);
//# sourceMappingURL=user.controller.js.map