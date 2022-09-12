import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortytwo.authguard';

@Controller('auth/42')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(FortyTwoAuthGuard)
  login() {
    return ;
  }

  @Get('callback')
  @UseGuards(FortyTwoAuthGuard)
  redirect(@Res() res: Response) {
    res.send(200);
  }

  @UseGuards()
  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    return response.status(200);
  }
}
