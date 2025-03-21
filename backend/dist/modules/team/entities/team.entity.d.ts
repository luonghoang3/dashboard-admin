import { User } from '../../user/entities/user.entity';
export declare class Team {
    id: string;
    name: string;
    description: string;
    isActive: boolean;
    department: string;
    users: User[];
    createdAt: Date;
    updatedAt: Date;
}
