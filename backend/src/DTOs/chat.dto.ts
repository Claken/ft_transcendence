import {
  } from 'class-validator';

export class CreateRoomDto {

	chatRoomName: string;

	ownerLogin?: string;

	ownerId?: number;

	administratorLogin?: string;

	isPublic: boolean;

	password?: string;
}