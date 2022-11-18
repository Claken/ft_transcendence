import {IMessageToBack} from './messageToBack.interface'

export interface IRoom {
	active: boolean;
	member: boolean;
	owner: string;
	name: string;
	type: number;
	messages: IMessageToBack[];
	usersList?: string[];		// A FAIRE
	adminsList?: string[];		// A FAIRE
	banList?: string[];			// A FAIRE
}