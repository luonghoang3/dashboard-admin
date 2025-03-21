import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getRepository } from 'typeorm';
import { User, UserRole } from '../modules/user/entities/user.entity';
import * as bcrypt from 'bcrypt';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userRepository = getRepository(User);

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

  await app.close();
}

bootstrap()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Lỗi khi seed dữ liệu:', error);
    process.exit(1);
  }); 