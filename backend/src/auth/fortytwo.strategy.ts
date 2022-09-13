import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';
import { AuthProvider } from './models/auths.interface';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    @Inject('AUTH_SERVICE') private readonly authService: AuthProvider,
  ) {
    super({
      clientID: process.env.FORTYTWO_APP_UID,
      clientSecret: process.env.FORTYTWO_APP_SECRET,
      callbackURL: process.env.FORTYTWO_CALLBACK_URL,
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { username, id: userId, emails, profileUrl } = profile;
    const userDetails = { username, userId, emails, profileUrl };
    return await this.authService.validateUser(userDetails);
  }
}

