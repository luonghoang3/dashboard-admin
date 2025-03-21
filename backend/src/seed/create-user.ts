import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { UserService } from '../modules/user/services/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  try {
    // Get the UserService from the application
    const userService = app.get(UserService);

    // Create admin user
    await userService.create({
      username: 'admin',
      email: 'admin@example.com',
      password: 'admin123',
      fullName: 'Admin User',
      role: 'admin',
    });
    console.log('Tài khoản admin đã được tạo thành công!');

    // Create manager user
    await userService.create({
      username: 'manager',
      email: 'manager@example.com',
      password: 'manager123',
      fullName: 'Manager User',
      role: 'manager',
    });
    console.log('Tài khoản manager đã được tạo thành công!');

    // Create normal user
    await userService.create({
      username: 'user',
      email: 'user@example.com',
      password: 'user123',
      fullName: 'Normal User',
      role: 'user',
    });
    console.log('Tài khoản user thường đã được tạo thành công!');

  } catch (error) {
    // Check if it's a conflict error (user already exists)
    if (error.message && error.message.includes('đã tồn tại')) {
      console.log('Thông báo:', error.message);
    } else {
      console.error('Lỗi khi tạo tài khoản:', error);
    }
  } finally {
    await app.close();
  }
}

bootstrap(); 