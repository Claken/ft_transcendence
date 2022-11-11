export class IUser {
	id?: number;
	login?: string;
	name?: string;
	email?: string;
	avatar?: string;
	status?: string;
	twoFASecret?: string;
	isTwoFAEnabled?: boolean;
	isTwoFAValidated?: boolean;
}
