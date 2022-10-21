import {
  } from 'class-validator';

export class CreateRoomDto {

	id?: number;

	chatRoomName?: string;
  

	owner?: string;
  
	administrators?: string;



	isPublic: boolean;

	password?: string;

	createdAt?: Date;
}