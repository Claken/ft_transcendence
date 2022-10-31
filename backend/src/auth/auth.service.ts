import { Injectable, Res } from '@nestjs/common';
import { UsersEntity } from 'src/TypeOrm';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async register(user: UserDTO): Promise<UsersEntity> {
    const { id } = user;
    const userFound = await this.usersService.getById(id);
    if (userFound) {
      // if (userFound.isTwoFAEnabled)
        // res.redirect("http://localhost:3000/");
      // elseqq
        return(userFound);
    }
    
      // if (2FAenabled)
      // {
      //     if compare(hashTwoFASecret)
      //        connect
      //     else
      //        null
      // }
     
    return await this.usersService.create(user);
  }
}
