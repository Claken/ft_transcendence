import { IsOptional } from 'class-validator';

export class DmDto {
	@IsOptional()
	id: number;

  sender: string;

  receiver: string;

	@IsOptional()
  message: string;

	@IsOptional()
	read: boolean;
}