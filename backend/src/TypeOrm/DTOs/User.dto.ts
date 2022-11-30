import { Type } from 'class-transformer';
import { IsOptional, Length } from 'class-validator';
import { Request } from 'express';
import { ChatRoomEntity } from '../Entities/chat.entity';
import { Avatar } from '../Entities/avatar.entity';

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
  status?: string;

  @IsOptional()
  twoFASecret?: string;

  @IsOptional()
  isTwoFAEnabled?: boolean;

  @IsOptional()
  isTwoFAValidated?: boolean;

  @IsOptional()
  inQueue: boolean;

  @IsOptional()
  inGame: boolean;
  ownedChannels?: ChatRoomEntity[];

  @IsOptional()
  win?: number;

  @IsOptional()
  lose?: number;

  @IsOptional()
  avatar?:Avatar;

  @IsOptional()
  avatarId?: number;
}

export interface TwoFAValidation {
  code: string;
  user: UserDTO;
}

export interface RequestWithUser extends Request {
  user: UserDTO;
}

// export class TokenPayload {
//   user?: UserDTO;
//   isSecondFactorAuthenticated: boolean;
// }

