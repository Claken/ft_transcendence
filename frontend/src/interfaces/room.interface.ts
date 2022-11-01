import {IMessageToBack} from './messageToBack.interface'

export interface IRoom {
	active: boolean;
	member: boolean;
	owner: string;
	name: string;
	messages: IMessageToBack[];
}