import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';
import { Team } from '../../team/entities/team.entity';
export declare class UserService {
    private usersRepository;
    private teamsRepository;
    constructor(usersRepository: Repository<User>, teamsRepository: Repository<Team>);
    findAll(): Promise<User[]>;
    findById(id: string): Promise<User>;
    findByIdWithTeams(id: string): Promise<User>;
    findByUsername(username: string): Promise<User>;
    findByTeamId(teamId: string): Promise<User[]>;
    assignToTeam(userId: string, teamId: string): Promise<User>;
    removeFromTeam(userId: string, teamId: string): Promise<User>;
    create(createUserDto: CreateUserDto): Promise<User>;
    update(id: string, updateUserDto: UpdateUserDto): Promise<User>;
    remove(id: string): Promise<void>;
}
