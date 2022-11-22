import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-42';
import { UsersEntity } from 'src/TypeOrm';
import { AuthService } from '../auth.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
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
  ): Promise<UsersEntity> {
    const { username, id: apiId, emails } = profile;
    const userApi = {
      apiId,
      login: username,
      name: username,
      email: emails[0].value,
      inQueue: false,
      inGame: false,
    };

    // get the image with authorization token in headers
    const profileResponseObs = this.http.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const res = await lastValueFrom(profileResponseObs);
    const {image} = res.data;

    // Now make a request with the api image url
    const responseObs = this.http.get(image.link, { responseType: 'arraybuffer' });
    const response = await lastValueFrom(responseObs);
    const buf = Buffer.from(response.data, 'utf-8');
    return await this.authService.register(userApi, buf);
  }
}
