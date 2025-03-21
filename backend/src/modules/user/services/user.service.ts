import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Not, Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User, UserRole } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(): Promise<User[]> {
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    
    if (!user) {
      throw new NotFoundException(`Không tìm thấy người dùng với ID: ${id}`);
    }
    
    return user;
  }

  async findByUsername(username: string): Promise<User> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    // Kiểm tra username hoặc email đã tồn tại
    const userExists = await this.usersRepository.findOne({
      where: [
        { username: createUserDto.username },
        { email: createUserDto.email },
      ],
    });

    if (userExists) {
      throw new ConflictException('Tên đăng nhập hoặc email đã tồn tại');
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

    // Xác định role từ dữ liệu đầu vào
    let userRole: UserRole;
    switch (createUserDto.role) {
      case 'admin':
        userRole = UserRole.ADMIN;
        break;
      case 'manager':
        userRole = UserRole.MANAGER;
        break;
      default:
        userRole = UserRole.USER;
    }

    // Tạo người dùng mới với chuyển đổi role từ string sang enum
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

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findById(id);

    // Kiểm tra tên đăng nhập hoặc email nếu được cập nhật
    if (updateUserDto.username || updateUserDto.email) {
      const conditions = [];
      
      if (updateUserDto.username) {
        conditions.push({
          username: updateUserDto.username,
          id: Not(id)
        });
      }
      
      if (updateUserDto.email) {
        conditions.push({
          email: updateUserDto.email,
          id: Not(id)
        });
      }
      
      const userExists = await this.usersRepository.findOne({
        where: conditions,
      });

      if (userExists) {
        throw new ConflictException('Tên đăng nhập hoặc email đã tồn tại');
      }
    }

    // Mã hóa mật khẩu nếu được cập nhật
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }

    // Xử lý role nếu được cập nhật
    if (updateUserDto.role) {
      switch (updateUserDto.role) {
        case 'admin':
          updateUserDto.role = UserRole.ADMIN;
          break;
        case 'manager':
          updateUserDto.role = UserRole.MANAGER;
          break;
        default:
          updateUserDto.role = UserRole.USER;
      }
    }

    // Cập nhật thông tin người dùng
    Object.assign(user, updateUserDto);

    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
} 