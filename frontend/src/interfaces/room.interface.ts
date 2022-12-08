import {IMessageToBack} from './messageToBack.interface'

export interface IRoom {
	active: boolean;
	member: boolean;
	ban: boolean;
	mute: boolean;
	owner: string;
	name: string;
	type: number;
	messages: IMessageToBack[];
	usersList?: string[];
	adminsList?: string[];
	banList?: string[];
}