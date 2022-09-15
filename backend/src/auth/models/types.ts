import { IUser } from "src/TypeOrm/Entities/users.entity";

export type Cb = (err: Error, user: IUser) => void;