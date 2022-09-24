import { CanActivate, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { AuthService } from '../auth.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
  ) {
    super({
      clientID: configService.get<string>('FORTYTWO_APP_UID'),
      clientSecret: configService.get<string>('FORTYTWO_APP_SECRET'),
      callbackURL: configService.get<string>('FORTYTWO_CALLBACK_URL'),
      // profileFields: {
      //   'id': function (obj) { return String(obj.id); },
      //   'username': 'login',
      //   'displayName': 'displayname',
      //   'name.familyName': 'last_name',
      //   'name.givenName': 'first_name',
      //   'profileUrl': 'url',
      //   'emails.0.value': 'email',
      //   'phoneNumbers.0.value': 'phone',
      //   'photos.0.value': 'image_url'
      // }
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { username, id: userId, emails, photos } = profile;
    const user = { userId, login: username, email: emails[0].value, pictureUrl: photos[0].value };
    return await this.authService.register(user);
  }
}
