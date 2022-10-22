import { PartialType } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';

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
  createdAt?: Date;
}
  