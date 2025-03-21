import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { DataSource } from 'typeorm';
import { User, UserRole } from '../modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Lấy DataSource từ ứng dụng
  const dataSource = app.get(DataSource);
  const userRepository = dataSource.getRepository(User);

  // Seed Admin user
  try {
    // Kiểm tra xem đã có admin nào chưa
    const existingAdmin = await userRepository.findOne({
      where: { role: UserRole.ADMIN },
    });

    if (!existingAdmin) {
      console.log('Khởi tạo tài khoản admin...');

      // Tạo mật khẩu hash
      const hashedPassword = await bcrypt.hash('admin123', 10);

      // Tạo user admin
      const adminUser = userRepository.create({
        username: 'admin',
        email: 'admin@example.com',
        password: hashedPassword,
        fullName: 'Admin User',
        role: UserRole.ADMIN,
        isActive: true,
      });

      await userRepository.save(adminUser);
      console.log('Tài khoản admin đã được tạo thành công!');
    } else {
      console.log('Tài khoản admin đã tồn tại, bỏ qua bước seed.');
    }

    // Tạo tài khoản manager nếu chưa tồn tại
    const existingManager = await userRepository.findOne({
      where: { role: UserRole.MANAGER },
    });

    if (!existingManager) {
      console.log('Khởi tạo tài khoản manager...');

      // Tạo mật khẩu hash
      const hashedPassword = await bcrypt.hash('manager123', 10);

      // Tạo user manager
      const managerUser = userRepository.create({
        username: 'manager',
        email: 'manager@example.com',
        password: hashedPassword,
        fullName: 'Manager User',
        role: UserRole.MANAGER,
        isActive: true,
      });

      await userRepository.save(managerUser);
      console.log('Tài khoản manager đã được tạo thành công!');
    } else {
      console.log('Tài khoản manager đã tồn tại, bỏ qua bước seed.');
    }

    // Tạo tài khoản user thường nếu chưa tồn tại
    const existingUser = await userRepository.findOne({
      where: { role: UserRole.USER },
    });

    if (!existingUser) {
      console.log('Khởi tạo tài khoản user thường...');

      // Tạo mật khẩu hash
      const hashedPassword = await bcrypt.hash('user123', 10);

      // Tạo user thường
      const normalUser = userRepository.create({
        username: 'user',
        email: 'user@example.com',
        password: hashedPassword,
        fullName: 'Normal User',
        role: UserRole.USER,
        isActive: true,
      });

      await userRepository.save(normalUser);
      console.log('Tài khoản user thường đã được tạo thành công!');
    } else {
      console.log('Tài khoản user thường đã tồn tại, bỏ qua bước seed.');
    }

    console.log('Quá trình seed dữ liệu hoàn tất!');
  } catch (error) {
    console.error('Lỗi khi seed dữ liệu:', error);
  } finally {
    await app.close();
  }
}

bootstrap()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Lỗi chung khi seed dữ liệu:', error);
    process.exit(1);
  }); 