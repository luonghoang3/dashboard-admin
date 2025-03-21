import { Team } from '../../team/entities/team.entity';
export declare enum UserRole {
    ADMIN = "admin",
    MANAGER = "manager",
    USER = "user"
}
export declare class User {
    id: string;
    username: string;
    password: string;
    email: string;
    fullName: string;
    avatar: string;
    role: UserRole;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
    teams: Team[];
}
