import { Dispatch, SetStateAction } from "react";
import { IUser } from "./user.interface";

export interface IAuthContext {
	user: IUser;
	setUser: Dispatch<SetStateAction<IUser>>;
	loginAsGuest: (guestName: string) => Promise<void>;
	deleteGuestUser: () => void;
};
