export interface IGame {
	id?: number;
	loginLP?: string;
	loginRP?: string;
	scoreLP?: number;
	scoreRP?: number;
	abort?: string;
	isFinish?: boolean;
	waitingForOppenent?: boolean;
	date?: Date;
}
