export class IUser {
	id?: number;
	login?: string;
	name?: string;
	email?: string;
	pictureUrl?: string;
	status?: string;
	twoFASecret?: string;
	isTwoFAEnabled?: boolean;
	createdAt?: Date;
}
