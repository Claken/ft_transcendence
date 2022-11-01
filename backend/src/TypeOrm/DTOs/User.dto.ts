import { IsOptional } from 'class-validator';
import { ChatRoomEntity } from '../Entities/chat.entity';

export class UserDTO {
  @IsOptional()
  id?: number;

  @IsOptional()
  login?: string;

  @IsOptional()
  name?: string;

  @IsOptional()
  email?: string;

  @IsOptional()
  pictureUrl?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  ownedChannels?: ChatRoomEntity[];

  @IsOptional()
  createdAt?: Date;
}
  