import { IsUUID, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class AssignTeamDto {
  @ApiProperty({ description: 'ID của team' })
  @IsUUID()
  @IsNotEmpty()
  teamId: string;
} 