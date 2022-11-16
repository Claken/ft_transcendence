import {
  ClassSerializerInterceptor,
  Controller,
  Post,
  UseInterceptors,
  Res,
  UseGuards,
  Req,
  HttpCode,
  Body,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { RequestWithUser } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';
import { AuthenticatedGuard } from '../guards/fortytwo.guard';
import { TwoFactorAuthenticationService } from './two-factor-authentication.service';

@Controller('2fa')
@UseInterceptors(ClassSerializerInterceptor)
export class TwoFactorAuthenticationController {
  constructor(
    private readonly twoFAService: TwoFactorAuthenticationService,
    private readonly usersService: UsersService,
  ) {}

  // @Post('generate')
  // @UseGuards(AuthenticatedGuard)
  // async register(@Res() response: Response, @Req() request: Request) {
  //   const { otpauthUrl } = await this.twoFAService.generateTwoFASecret(
  //     request.user,
  //   );
  //   return this.twoFAService.pipeQrCodeStream(response, otpauthUrl);
  // }

  // @Post('turn-on')
  // @HttpCode(200)
  // @UseGuards(AuthenticatedGuard)
  // async turnOnTwoFA(
  //   @Req() request: RequestWithUser,
  //   @Body() { TwoFACode }: TwoFACodeDto,
  // ) {
  //   const isCodeValid = this.twoFAService.isTwoFACodeValid(
  //     TwoFACode,
  //     request.user,
  //   );
  //   if (!isCodeValid) {
  //     throw new UnauthorizedException('Wrong authentication code');
  //   }

  //   await this.usersService.turnOnOffTwoFA(request.user.id);
  // }

  // @Post('authenticate')
  // @HttpCode(200)
  // @UseGuards(AuthenticatedGuard)
  // async authenticate(
  //   @Req() request: RequestWithUser,
  //   @Body() { TwoFACode } : TwoFACodeDto,
  //   @Res() res: Response
  // ) {
  //   const isCodeValid = this.twoFAService.isTwoFACodeValid(
  //     TwoFACode, request.user
  //   );
  //   if (!isCodeValid) {
  //     throw new UnauthorizedException('Wrong authentication code');
  //   }

  //   //TODO: register hashed twoFASecret in database
  //   //TODO: pass it as a cookie
  //   //TODO: redirect to LoginWithTwoFA
  //   //TODO: redirect to front if succeed;

  //   // const twoFASecret = ;
 
  //   // res.cookie('twoFASecret', twoFASecret);
 
  //   return request.user;
  // }

}
