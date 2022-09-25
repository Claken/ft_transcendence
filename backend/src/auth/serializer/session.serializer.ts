import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersEntity } from 'src/TypeOrm';
import { IUser } from 'src/TypeOrm/Entities/users.entity';
import { AuthService } from '../auth.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly authService: AuthService) {
    super();
  }

  serializeUser(user: any, done: (err: Error, user: IUser) => void) {
    done(null, user); // user is the data to stored inside the session
  }

  async deserializeUser(payload: any, done: (err: Error, user: IUser) => void) {
    done(null, payload); // callback payload make req.user acessible through controller
  }
}
