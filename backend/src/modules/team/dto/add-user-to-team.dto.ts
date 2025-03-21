import { IsString, IsNotEmpty, IsUUID } from 'class-validator';

export class AddUserToTeamDto {
  @IsUUID()
  @IsNotEmpty()
  userId: string;
} 