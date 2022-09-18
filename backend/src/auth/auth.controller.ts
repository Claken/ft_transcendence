import { Controller, Get, Req, Res, UseGuards, Post } from '@nestjs/common';
import { Request, Response } from 'express';
import {
  AuthenticatedGuard,
  FortyTwoAuthGuard,
} from './guards/fortytwo.authguard';
import { AuthService } from './auth.service';
import { IUser } from 'src/TypeOrm/Entities/users.entity';
import { JwtStrategy } from './strategies/jwt.strategy';

@Controller('auth/42')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('login')
  @UseGuards(FortyTwoAuthGuard)
  login(@Req() req: Request): Promise<{ access_token: string }> {
    return this.authService.login(req.user as IUser);
  }

  @Get('callback')
  @UseGuards(JwtStrategy)
  redirect(@Res() res: Response) {
    res.send(200);
  }

  @Get('test')
  //   @UseGuards(AuthenticatedGuard)
  mytest() {
    return 'test';
  }

  @UseGuards()
  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    return response.status(200);
  }
}
