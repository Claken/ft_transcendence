import {IMessageToBack} from './messageToBack.interface'

export interface IRoom {
	active: boolean;
	member: boolean;
	owner: string;
	name: string;
	type: number;
	messages: IMessageToBack[];
	usersList?: string[];
	adminsList?: string[];
	banList?: string[];
}