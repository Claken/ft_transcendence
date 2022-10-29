import { IsOptional } from 'class-validator';
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
  pictureUrl?: string;

  @IsOptional()
  status?: string;

  @IsOptional()
  hashTwoFASecret?: string;

  @IsOptional()
  createdAt?: Date;

  @IsOptional()
  isTwoFAEnabled?: boolean;
}

export class TwoFACodeDto {
  TwoFACode: string;
}

export interface RequestWithUser extends Request {
  user?: UserDTO;
}

export class TokenPayload {
  user?: UserDTO;
  isSecondFactorAuthenticated: boolean;
}