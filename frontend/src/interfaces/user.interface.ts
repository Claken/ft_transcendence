export class IUser {
	id?: number;
	login?: string;
	name?: string;
	email?: string;
	firstAvatarUrl?: string;
	inQueue: boolean;
	inGame: boolean;
	status?: string;
	twoFASecret?: string;
	isTwoFAEnabled?: boolean;
	isTwoFAValidated?: boolean;
	createdAt?: Date;
	win?: number;
	lose?: number;
	avatarId?: number;
}
