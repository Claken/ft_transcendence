export class IUser {
	id?: number;
	login?: string;
	name?: string;
	email?: string;
	avatarUrl?: string;
	status?: string;
	twoFASecret?: string;
	isTwoFAEnabled?: boolean;
	isTwoFAValidated?: boolean;
}
