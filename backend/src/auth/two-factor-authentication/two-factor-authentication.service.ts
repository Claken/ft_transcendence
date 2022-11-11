import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { authenticator } from 'otplib';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';
import { toFileStream } from 'qrcode';
import { Response } from 'express';
import * as bcrypt from 'bcrypt';

@Injectable()
export class TwoFactorAuthenticationService {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  public setOtpauthUrl(name: string, secret: string) {
    return authenticator.keyuri(
      name,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );
  }
  public async generateTwoFASecret(user: UserDTO) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = this.setOtpauthUrl(user.name, user.twoFASecret);

    await this.usersService.setTwoFASecret(secret, user.id);

    return {
      secret, // TODO: bcrypt necessary?
      otpauthUrl,
    };
  }

  public isTwoFACodeValid(twoFACode: string, user: UserDTO) {
    return authenticator.verify({
      token: twoFACode,
      secret: user.twoFASecret,
    });
  }
}
