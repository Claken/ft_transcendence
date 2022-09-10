import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-42';
import { VerifyCallback } from 'passport-jwt';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class FortyTwoStrategy extends PassportStrategy(
  Strategy,
  'passport-42',
) {
  constructor() {
    super(
      {
        clientID: process.env.FORTYTWO_APP_ID,
        clientSecret: process.env.FORTYTWO_APP_SECRET,
        callbackURL: process.env.FORTYTWO_CALLBACK_URL,
        // scope: 'game etc...'
      },
      (
        accessToken: string,
        refreshToken: string,
        expires_in: number,
        profile: CreateUserDto,
        done: VerifyCallback,
      ): void => {
        return done(null, profile, { accessToken, refreshToken, expires_in });
      },
    );
  }
}
