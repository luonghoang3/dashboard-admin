"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = __importStar(require("bcrypt"));
const user_entity_1 = require("../entities/user.entity");
let UserService = class UserService {
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async findAll() {
        return this.usersRepository.find();
    }
    async findById(id) {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new common_1.NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
        }
        return user;
    }
    async findByUsername(username) {
        return this.usersRepository.findOne({ where: { username } });
    }
    async create(createUserDto) {
        const userExists = await this.usersRepository.findOne({
            where: [
                { username: createUserDto.username },
                { email: createUserDto.email },
            ],
        });
        if (userExists) {
            throw new common_1.ConflictException('Tên đăng nhập hoặc email đã tồn tại');
        }
        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
        let userRole;
        switch (createUserDto.role) {
            case 'admin':
                userRole = user_entity_1.UserRole.ADMIN;
                break;
            case 'manager':
                userRole = user_entity_1.UserRole.MANAGER;
                break;
            default:
                userRole = user_entity_1.UserRole.USER;
        }
        const newUser = this.usersRepository.create({
            username: createUserDto.username,
            email: createUserDto.email,
            fullName: createUserDto.fullName,
            avatar: createUserDto.avatar,
            role: userRole,
            password: hashedPassword,
        });
        return this.usersRepository.save(newUser);
    }
    async update(id, updateUserDto) {
        const user = await this.findById(id);
        if (updateUserDto.username || updateUserDto.email) {
            const conditions = [];
            if (updateUserDto.username) {
                conditions.push({
                    username: updateUserDto.username,
                    id: (0, typeorm_2.Not)(id)
                });
            }
            if (updateUserDto.email) {
                conditions.push({
                    email: updateUserDto.email,
                    id: (0, typeorm_2.Not)(id)
                });
            }
            const userExists = await this.usersRepository.findOne({
                where: conditions,
            });
            if (userExists) {
                throw new common_1.ConflictException('Tên đăng nhập hoặc email đã tồn tại');
            }
        }
        if (updateUserDto.password) {
            updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
        }
        if (updateUserDto.role) {
            switch (updateUserDto.role) {
                case 'admin':
                    updateUserDto.role = user_entity_1.UserRole.ADMIN;
                    break;
                case 'manager':
                    updateUserDto.role = user_entity_1.UserRole.MANAGER;
                    break;
                default:
                    updateUserDto.role = user_entity_1.UserRole.USER;
            }
        }
        Object.assign(user, updateUserDto);
        return this.usersRepository.save(user);
    }
    async remove(id) {
        const user = await this.findById(id);
        await this.usersRepository.remove(user);
    }
};
exports.UserService = UserService;
exports.UserService = UserService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserService);
//# sourceMappingURL=user.service.js.map