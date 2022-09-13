import { IUser } from "src/users/models/users.interface";

export interface AuthProvider {
    validateUser(userDetails: IUser);
    createUser(userDetails: IUser);
    findUserById(userId: number): Promise<IUser | undefined>;
}