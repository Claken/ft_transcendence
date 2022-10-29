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

  public async generateTwoFASecret(user: UserDTO) {
    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(
      user.name,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      secret,
    );

    const hashTwoFASecret = await bcrypt.hash(secret, 10);

    await this.usersService.setTwoFASecret(hashTwoFASecret, user.id);

    return {
      hashTwoFASecret,
      otpauthUrl,
    };
  }

  public async pipeQrCodeStream(stream: Response, otpauthUrl: string) {
    return toFileStream(stream, otpauthUrl);
  }

  public isTwoFACodeValid(twoFACode: string, user: UserDTO) {
    
    return authenticator.verify({
      token: twoFACode,
      secret: user.hashTwoFASecret, // TODO: bcrypt.compare necessary?
    });
  }

}
