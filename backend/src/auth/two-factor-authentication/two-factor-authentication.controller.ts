import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard } from '../guards/fortytwo.guard';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';
@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFactorAuthenticationService: TwoFactorAuthenticationService,
  ) {}

  @Post('generate')
  @UseGuards(AuthenticatedGuard)
  async register(@Res() response: Response, @Req() request: Request) {
    const { otpauthUrl } =
      await this.twoFactorAuthenticationService.generateTwoFASecret(
        request.user,
      );

    return this.twoFactorAuthenticationService.pipeQrCodeStream(
      response,
      otpauthUrl,
    );
  }
}
