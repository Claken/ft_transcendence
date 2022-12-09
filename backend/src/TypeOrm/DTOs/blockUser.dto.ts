import { IsOptional } from 'class-validator';

export class BlockUserDto {
	@IsOptional()
	id: number;

  sender: number;

  blocked: number;
}