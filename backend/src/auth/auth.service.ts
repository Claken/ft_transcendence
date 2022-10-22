import { Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/TypeOrm';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(user: UserDTO): Promise<UsersEntity> {
    const { id } = user;
    const userFound = await this.usersService.getById(id);
    if (userFound) return userFound;
    return await this.usersService.create(user);
  }
}
