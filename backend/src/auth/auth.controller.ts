import {
  Controller,
  Get,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
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
  logout(@Req() req: Request, @Res() response: Response) {
  }
}
