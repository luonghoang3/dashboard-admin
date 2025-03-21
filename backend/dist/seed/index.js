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
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const typeorm_1 = require("typeorm");
const user_entity_1 = require("../modules/user/entities/user.entity");
const bcrypt = __importStar(require("bcrypt"));
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const dataSource = app.get(typeorm_1.DataSource);
    const userRepository = dataSource.getRepository(user_entity_1.User);
    try {
        const existingAdmin = await userRepository.findOne({
            where: { role: user_entity_1.UserRole.ADMIN },
        });
        if (!existingAdmin) {
            console.log('Khởi tạo tài khoản admin...');
            const hashedPassword = await bcrypt.hash('admin123', 10);
            const adminUser = userRepository.create({
                username: 'admin',
                email: 'admin@example.com',
                password: hashedPassword,
                fullName: 'Admin User',
                role: user_entity_1.UserRole.ADMIN,
                isActive: true,
            });
            await userRepository.save(adminUser);
            console.log('Tài khoản admin đã được tạo thành công!');
        }
        else {
            console.log('Tài khoản admin đã tồn tại, bỏ qua bước seed.');
        }
        const existingManager = await userRepository.findOne({
            where: { role: user_entity_1.UserRole.MANAGER },
        });
        if (!existingManager) {
            console.log('Khởi tạo tài khoản manager...');
            const hashedPassword = await bcrypt.hash('manager123', 10);
            const managerUser = userRepository.create({
                username: 'manager',
                email: 'manager@example.com',
                password: hashedPassword,
                fullName: 'Manager User',
                role: user_entity_1.UserRole.MANAGER,
                isActive: true,
            });
            await userRepository.save(managerUser);
            console.log('Tài khoản manager đã được tạo thành công!');
        }
        else {
            console.log('Tài khoản manager đã tồn tại, bỏ qua bước seed.');
        }
        const existingUser = await userRepository.findOne({
            where: { role: user_entity_1.UserRole.USER },
        });
        if (!existingUser) {
            console.log('Khởi tạo tài khoản user thường...');
            const hashedPassword = await bcrypt.hash('user123', 10);
            const normalUser = userRepository.create({
                username: 'user',
                email: 'user@example.com',
                password: hashedPassword,
                fullName: 'Normal User',
                role: user_entity_1.UserRole.USER,
                isActive: true,
            });
            await userRepository.save(normalUser);
            console.log('Tài khoản user thường đã được tạo thành công!');
        }
        else {
            console.log('Tài khoản user thường đã tồn tại, bỏ qua bước seed.');
        }
        console.log('Quá trình seed dữ liệu hoàn tất!');
    }
    catch (error) {
        console.error('Lỗi khi seed dữ liệu:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap()
    .then(() => process.exit(0))
    .catch((error) => {
    console.error('Lỗi chung khi seed dữ liệu:', error);
    process.exit(1);
});
//# sourceMappingURL=index.js.map