import { IUser } from 'src/TypeOrm/Entities/users.entity';

export interface IAuth {
  validateUser(userDetails: IUser);
  createUser(userDetails: IUser);
  findUserById(userId: number): Promise<IUser | undefined>;
}
