import { Team } from '../../team/entities/team.entity';
declare enum UserRole {
    ADMIN = "admin",
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
export {};
