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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateUserDto = void 0;
const swagger_1 = require("@nestjs/swagger");
const class_validator_1 = require("class-validator");
class CreateUserDto {
}
exports.CreateUserDto = CreateUserDto;
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin', description: 'Tên đăng nhập' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên đăng nhập không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Tên đăng nhập phải là chuỗi' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "username", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin@example.com', description: 'Email' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Email không được để trống' }),
    (0, class_validator_1.IsEmail)({}, { message: 'Email không hợp lệ' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "email", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'password123', description: 'Mật khẩu' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Mật khẩu không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Mật khẩu phải là chuỗi' }),
    (0, class_validator_1.MinLength)(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "password", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'Admin User', description: 'Tên đầy đủ' }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Tên đầy đủ không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Tên đầy đủ phải là chuỗi' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "fullName", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'admin', description: 'Vai trò', enum: ['admin', 'user'] }),
    (0, class_validator_1.IsNotEmpty)({ message: 'Vai trò không được để trống' }),
    (0, class_validator_1.IsString)({ message: 'Vai trò phải là chuỗi' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "role", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ example: 'https://example.com/avatar.jpg', description: 'URL avatar', required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)({ message: 'Avatar phải là chuỗi' }),
    __metadata("design:type", String)
], CreateUserDto.prototype, "avatar", void 0);
//# sourceMappingURL=create-user.dto.js.map