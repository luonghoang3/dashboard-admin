import { UserService } from '../services/user.service';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { User } from '../entities/user.entity';
import { UserRole } from '../entities/user.entity';
import { AssignTeamDto } from '../dto/assign-team.dto';
export declare class UserController {
    private readonly userService;
    constructor(userService: UserService);
    getProfile(req: any): Promise<User>;
    getProfileWithTeams(req: any): Promise<User>;
    findOneWithTeams(id: string): Promise<User>;
    assignToTeam(id: string, assignTeamDto: AssignTeamDto): Promise<User>;
    removeFromTeam(id: string, teamId: string): Promise<User>;
    getUsersByTeam(teamId: string): Promise<User[]>;
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
