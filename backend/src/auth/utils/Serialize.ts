import { Inject, Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersEntity } from 'src/users/models/users.entity';
import { AuthProvider } from '../models/auths.interface';
import { Cb } from '../models/types';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthProvider,
  ) {
    super();
  }

  serializeUser(user: UsersEntity, cb: Cb) {
    cb(null, user);
  }

  async deserializeUser(user: UsersEntity, cb: Cb) {
    const userDB = await this.authService.findUserById(user.id);
    return userDB ? cb(null, userDB) : cb(null, null);
  }
}
