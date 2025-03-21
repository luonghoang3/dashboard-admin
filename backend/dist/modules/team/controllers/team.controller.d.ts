import { TeamService } from '../services/team.service';
import { CreateTeamDto, UpdateTeamDto, AddUserToTeamDto, QueryTeamDto } from '../dto';
import { Team } from '../entities/team.entity';
import { User } from '../../user/entities/user.entity';
export declare class TeamController {
    private readonly teamService;
    constructor(teamService: TeamService);
    create(createTeamDto: CreateTeamDto): Promise<Team>;
    createTestTeam(): Promise<any>;
    findAll(query: QueryTeamDto): Promise<any>;
    findAllPublic(): Promise<any>;
    healthCheck(): Promise<any>;
    findOne(id: string): Promise<Team>;
    update(id: string, updateTeamDto: UpdateTeamDto): Promise<Team>;
    remove(id: string): Promise<void>;
    addUserToTeam(teamId: string, addUserToTeamDto: AddUserToTeamDto): Promise<Team>;
    removeUserFromTeam(teamId: string, userId: string): Promise<Team>;
    getUsersByTeam(teamId: string): Promise<User[]>;
}
