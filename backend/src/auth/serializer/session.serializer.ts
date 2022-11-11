import { Injectable } from '@nestjs/common';
import { PassportSerializer } from '@nestjs/passport';
import { UsersEntity } from 'src/TypeOrm';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private readonly usersService: UsersService) {
    super();
  }
  // serialize is like write a post-it
  serializeUser(user: any, done: (err: Error, user: UsersEntity) => void) {
    // user.id the data stored inside the session
    done(null, user.id);
  }

  // deserialize is like read a post-it
  async deserializeUser(
    userId: string,
    done: (err: Error, user: UsersEntity) => void,
  ) {
    const user = await this.usersService.getById(Number(userId));
    // callback make req.user acessible through controller
    done(null, user);
  }
}
