export class IUser {
	id?: number;
	login?: string;
	name?: string;
	email?: string;
	pictureUrl?: string;
	inQueue: boolean;
	inGame: boolean;
	status?: string;
	createdAt?: Date;
}
