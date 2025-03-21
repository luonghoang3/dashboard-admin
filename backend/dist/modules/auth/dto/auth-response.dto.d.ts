import { User } from '../../user/entities/user.entity';
export declare class AuthResponseDto {
    accessToken: string;
    user: Partial<User>;
}
