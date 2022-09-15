import { Injectable, UnauthorizedException } from '@nestjs/common';
import { IUser } from 'src/TypeOrm/Entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { IAuth } from './models/auths.interface';

@Injectable()
export class AuthService implements IAuth {
  constructor(private usersService: UsersService) {}

  async validateUser(userDetails: IUser) {
    const { id: userId } = userDetails;
    const userFound = await this.usersService.getById(userId);
    if (userFound) return userFound;
    // should throw error if !userFound you cannot connect
    return this.createUser(userDetails);
  }
  createUser(userDetails: IUser) {
    return this.usersService.create(userDetails);
  }

  async findUserById(userId: number): Promise<IUser | undefined> {
    return await this.usersService.getById(userId);
  }
}
