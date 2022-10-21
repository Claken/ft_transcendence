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
	// owner: UsersEntity;
  
	@IsOptional()
	administrators: string;
	// administrators: UsersEntity;

	isPublic: boolean;

	@IsOptional()
	password: string;

	@IsOptional()
	createdAt: Date;
}