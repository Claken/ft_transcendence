import {
	isNotEmpty,
	IsOptional,
} from 'class-validator';

import { UsersEntity } from '../Entities/users.entity';

export class CreateRoomDto {

	@IsOptional()
	id: number;

	chatRoomName: string;
  
	@IsOptional()
	owner: string;

	@IsOptional()
	administrators: string;

	isPublic: boolean;

	@IsOptional()
	password: string;
}