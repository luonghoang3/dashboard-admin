"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const user_service_1 = require("../modules/user/services/user.service");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    try {
        const userService = app.get(user_service_1.UserService);
        await userService.create({
            username: 'admin',
            email: 'admin@example.com',
            password: 'admin123',
            fullName: 'Admin User',
            role: 'admin',
        });
        console.log('Tài khoản admin đã được tạo thành công!');
        await userService.create({
            username: 'manager',
            email: 'manager@example.com',
            password: 'manager123',
            fullName: 'Manager User',
            role: 'manager',
        });
        console.log('Tài khoản manager đã được tạo thành công!');
        await userService.create({
            username: 'user',
            email: 'user@example.com',
            password: 'user123',
            fullName: 'Normal User',
            role: 'user',
        });
        console.log('Tài khoản user thường đã được tạo thành công!');
    }
    catch (error) {
        if (error.message && error.message.includes('đã tồn tại')) {
            console.log('Thông báo:', error.message);
        }
        else {
            console.error('Lỗi khi tạo tài khoản:', error);
        }
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=create-user.js.map