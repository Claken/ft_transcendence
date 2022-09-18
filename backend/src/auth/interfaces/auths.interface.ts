import { IUser } from 'src/TypeOrm/Entities/users.entity';

export interface IAuth {
  validateUser(userDetails: IUser);
  findUserById(userId: number): Promise<IUser | undefined>;
}
