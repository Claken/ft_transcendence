import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-oauth2';
import { UsersEntity } from 'src/TypeOrm';
import { AuthService } from '../auth.service';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(Strategy, '42') {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService,
    private readonly http: HttpService,
  ) {
    super({
      authorizationURL: configService.get<string>('FORTYTWO_APP_AUTHORIZATION_URL'),
      tokenURL: configService.get<string>('FORTYTWO_APP_TOKEN_URL'),
      clientID: configService.get<string>('FORTYTWO_APP_UID'),
      clientSecret: configService.get<string>('FORTYTWO_APP_SECRET'),
      callbackURL: configService.get<string>('FORTYTWO_CALLBACK_URL'),
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    done: VerifyCallback,
  ): Promise<UsersEntity> {
    // get the image with authorization token from api42
    const profileResponseObs = this.http.get('https://api.intra.42.fr/v2/me', {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    const res = await lastValueFrom(profileResponseObs);
    const { login: apiLogin, email: apiEmail, image } = res.data;

    const userApi: UserDTO = {
      login: apiLogin,
      name: apiLogin,
      email: apiEmail,
      inQueue: false,
      inGame: false,
    };

    // Make a request with the api42 image url
    const responseObs = this.http.get(image.versions.medium, {
      responseType: 'arraybuffer',
    });
    const response = await lastValueFrom(responseObs);
    const buf = Buffer.from(response.data, 'utf-8');
    return await this.authService.register(userApi, buf);
  }
}
