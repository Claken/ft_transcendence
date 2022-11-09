import { IsOptional } from 'class-validator';

export class DmDto {
	id?: number;

  sender: string;

  receiver: string;

  message: string;
}