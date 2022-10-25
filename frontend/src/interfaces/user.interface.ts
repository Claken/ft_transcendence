export class IUser {
	id?: number;
	login?: string;
	name?: string;
	email?: string;
	pictureUrl?: string;
	status?: string;
	twoFA?: string;
	isTwoFA?: boolean;
	createdAt?: Date;
}
