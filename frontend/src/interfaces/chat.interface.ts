import {IMessageToBack} from './messageToBack.interface'
import { IUser } from './user.interface';

export interface IChatRoom {
	id?: number;

	chatRoomName?: string;

	owner?: string;

	type: number;

	password?: string;

	InviteUserName?: string;

	InviteGameId?: number;

	// active?: boolean;

	// member?: boolean;

	// messages?: IMessageToBack[];
}
