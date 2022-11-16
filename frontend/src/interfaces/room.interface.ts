import {IMessageToBack} from './messageToBack.interface'

export interface IRoom {
	active: boolean;
	member: boolean;
	owner: string;
	name: string;
	messages: IMessageToBack[];
	isPublic?: boolean,			// A FAIRE
	usersList?: string[],		// A FAIRE
	adminsList?: string[],		// A FAIRE
	banList?: string[],			// A FAIRE
	type?: number,
}