import { Type } from 'class-transformer';
import { IsOptional, Length } from 'class-validator';
import { Request } from 'express';

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
  avatar?: string;

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

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  win?: number;

  @IsOptional()
  lose?: number;
}

export interface TwoFAValidation {
  code: string;
  user: UserDTO;
}

export interface RequestWithUser extends Request {
  user?: UserDTO;
}

export class TokenPayload {
  user?: UserDTO;
  isSecondFactorAuthenticated: boolean;
}

