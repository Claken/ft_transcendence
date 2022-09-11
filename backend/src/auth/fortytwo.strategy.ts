import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-oauth2';
import { AuthService } from './auth.service';
import { UsersPost } from 'src/users/models/users.interface';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(
  Strategy,
  'passport-42',
) {
  constructor(private authService: AuthService, private user: UsersPost) {
    super({
      clientID: process.env.FORTYTWO_APP_UID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL,
    });
  }
  async validate(accessToken: string, refreshToken: string): Promise<any> {

    // return this.authService.findUserById(data.id);
  }
}
