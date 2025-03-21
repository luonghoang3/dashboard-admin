import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user.entity';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    create(createUserDto: CreateUserDto): Promise<User>;
    createTestAdmin(): Promise<{
        message: string;
        user: {
            id: string;
            username: string;
            email: string;
            fullName: string;
            role: UserRole;
        };
        loginInfo: {
            username: string;
            password: string;
        };
    } | {
        message: string;
        loginInfo: {
            username: string;
            password: string;
        };
        user?: undefined;
    }>;
    findAll(): Promise<User[]>;
    findOne(id: string): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
}
