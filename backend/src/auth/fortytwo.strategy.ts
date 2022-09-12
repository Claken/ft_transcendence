import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile } from 'passport-42';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(configService: ConfigService) {
    super({
      clientID: configService.get<string>('FORTYTWO_APP_UID'),
      clientSecret: configService.get<string>('FORTYTWO_APP_SECRET'),
      callbackURL: configService.get<string>('FORTYTWO_CALLBACK_URL'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ): Promise<any> {
    const { username, id, emails } = profile;
    console.log(username, id, emails);
    // this.authService.findUserById(profile.);
  }
}
