import {
	isNotEmpty,
	IsOptional,
	IsString,
	IsInt,
	Min,
	Max,
	IsNumber,
	MaxLength,
	IsAlphanumeric,
	min,
} from 'class-validator';

import { UsersEntity } from '../Entities/users.entity';
import { type } from 'src/exports/enum';

export class ChatRoomDto {

	@IsOptional()
	@IsNumber()
	id: number;

	@IsString()
	@MaxLength(20)
	@IsAlphanumeric()
	chatRoomName: string;
  
	@IsString()
	owner: string;
	
	@IsInt()
	@Min(type.public)
	@Max(type.protected)
	type: number;

	@IsOptional()
	@IsNumber()
	InviteGameId: number;

	@IsOptional()
	@IsString()
	InviteUserName: string;

	@IsOptional()
	@IsString()
	password: string;
}
