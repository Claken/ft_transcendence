import { IUser } from "src/users/models/users.interface";

export type Cb = (err: Error, user: IUser) => void;