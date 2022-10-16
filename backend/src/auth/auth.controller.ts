import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthenticatedGuard, FortyTwoAuthGuard } from './guards/fortytwo.guard';

@Controller('auth/42')
export class AuthController {
  constructor() {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('login')
  register(@Req() req: Request, @Res() res: Response) {
    return req.user;
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  @Redirect('http://localhost:3000')
  login(@Req() req: Request, @Res() res: Response) {
    return req.user;
  }

  @Get('me')
  test(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(AuthenticatedGuard)
  @Get('logout')
  @Redirect('http://localhost:3000')
  async logOut(@Req() req: Request) {
    // logOut() => removes the session from the memory of the webserver
    req.logOut((err) => {
      console.log(err);
    }); // without the callback an error occured...
    // set maxAge to 0 remove the cookie from the browser
    req.session.cookie.maxAge = 0;
  }
}
