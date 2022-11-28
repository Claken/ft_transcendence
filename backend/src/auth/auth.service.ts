import { Injectable } from '@nestjs/common';
import { UsersEntity } from 'src/TypeOrm';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(user: UserDTO, buffer: Buffer): Promise<UsersEntity> {
    const { login } = user;
    const userFound = await this.usersService.getByLogin(login); //name = login
    if (userFound) return userFound;

    return await this.usersService.create(user, buffer);
  }
  // async register(user: UserDTO): Promise<TokenPayload> {
  //   const { id } = user;
  //   const userFound = await this.usersService.getById(id);
  //   let tokenPayload: TokenPayload = {
  //     user: userFound,
  //     isSecondFactorAuthenticated: false
  //   };
  //   if (userFound) {
  //     if (userFound.isTwoFAEnabled) {
  //       tokenPayload.isSecondFactorAuthenticated = true;
  //     }
  //     return tokenPayload;
  //   }
  //   tokenPayload.user = await this.usersService.create(user);
  //   return tokenPayload;
  // }
}
