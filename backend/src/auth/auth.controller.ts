import {
  Controller,
  Get,
  Redirect,
  Req,
  UseGuards,
} from '@nestjs/common';
import { Request } from 'express';
import { AuthenticatedGuard, FortyTwoAuthGuard } from './guards/fortytwo.guard';
import { AuthService } from './auth.service';

@Controller('auth/42')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('login')
  register(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  @Redirect('/auth/42/test')
  login(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('test')
  mytest(@Req() req: Request) {
    return "test";
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  async logOut(@Req() req: Request) {
    // logOut() => removes the session from the memory of the webserver
    req.logOut(() => void {}); // without the callback an error occured...
    req.session.cookie.maxAge = 0;
  }
}
