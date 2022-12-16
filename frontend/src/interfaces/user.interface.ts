export class IUser {
	id?: number;
	login?: string;
	name?: string;
	email?: string;
	inQueue: boolean;
	inGame: boolean;
	hasSentAnInvite: boolean;
	status?: string;
	twoFASecret?: string;
	isTwoFAEnabled?: boolean;
	isTwoFAValidated?: boolean;
	createdAt?: Date;
	win?: number;
	lose?: number;
	avatarId?: number;
	avatarUrl?: string;
}
