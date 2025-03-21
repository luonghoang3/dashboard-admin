import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { AuthResponseDto } from '../dto/auth-response.dto';
export declare class AuthService {
    private usersRepository;
    private jwtService;
    constructor(usersRepository: Repository<User>, jwtService: JwtService);
    validateUser(username: string, password: string): Promise<any>;
    login(user: any): Promise<AuthResponseDto>;
    findUserById(id: string): Promise<User>;
}
