import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { IAuth } from '../interfaces/auths.interface';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(@Inject('AUTH_SERVICE') private readonly authService: IAuth) { //TODO: change Inject to AuthService provider
    super({
      clientID: process.env.FORTYTWO_APP_UID, //TODO: configServiceg.get
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
	profile: Profile,
	done: VerifyCallback
  ): Promise<any> {
    const { username, id: userId, emails, profileUrl } = profile;
    const user = { username, userId, emails, profileUrl, accessToken };
    return done(null, user);
  }
}
