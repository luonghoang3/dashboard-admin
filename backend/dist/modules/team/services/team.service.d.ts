import { Repository } from 'typeorm';
import { Team } from '../entities/team.entity';
import { User } from '../../user/entities/user.entity';
import { CreateTeamDto, UpdateTeamDto, QueryTeamDto } from '../dto';
export declare class TeamService {
    private readonly teamRepository;
    private readonly userRepository;
    private readonly logger;
    constructor(teamRepository: Repository<Team>, userRepository: Repository<User>);
    create(createTeamDto: CreateTeamDto): Promise<Team>;
    findAll(queryParams?: QueryTeamDto): Promise<Team[]>;
    findOne(id: string): Promise<Team>;
    update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team>;
    remove(id: string): Promise<void>;
    addUserToTeam(teamId: string, userId: string): Promise<Team>;
    removeUserFromTeam(teamId: string, userId: string): Promise<Team>;
    getUsersByTeam(teamId: string): Promise<User[]>;
}
