import {IMessageToBack} from './messageToBack.interface'
import { IUser } from './user.interface';

export interface IChatRoom {
	id?: number;

	chatRoomName?: string;

	owner?: string;
  
	administrators?: string;

	type: number;

	password?: string;

	createdAt?: Date;

	// active?: boolean;

	// member?: boolean;

	// messages?: IMessageToBack[];
}