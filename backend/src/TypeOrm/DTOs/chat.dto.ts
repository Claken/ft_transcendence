import {
	isNotEmpty,
	IsOptional,
	IsInt,
	Min,
	Max,
} from 'class-validator';

import { UsersEntity } from '../Entities/users.entity';
import { type } from 'src/exports/enum';

export class CreateRoomDto {

	@IsOptional()
	id: number;

	chatRoomName: string;
  
	@IsOptional()
	owner: string;

	@IsOptional()
	administrators: string;
	
	@IsInt()
	@Min(type.public)
	@Max(type.protected)
	type: number;

	@IsOptional()
	password: string;
}