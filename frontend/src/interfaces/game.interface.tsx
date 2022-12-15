export interface IGame {
	id?: number;
	loginLP?: string;
	nameLP?: string;
	loginRP?: string;
	nameRP?: string;
	scoreLP?: number;
	scoreRP?: number;
	abort?: string;
	isFinish?: boolean;
	waitingForOppenent?: boolean;
	map?: number;
	date?: Date;
}
