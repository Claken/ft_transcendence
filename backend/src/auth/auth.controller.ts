import { Controller, Get, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { FortyTwoAuthGuard } from './guards/fortytwo.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { IUser } from 'src/TypeOrm/Entities/users.entity';
import { use } from 'passport';

@Controller('auth/42')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('login')
  register(@Req() req: Request) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  async login(
    @Req() req: Request,
    @Res() res: Response,
  ) {
    await this.authService.login(req.user as IUser);
    return res.redirect('/auth/42/test');
  }


  @UseGuards(JwtAuthGuard)
  @Get('test')
  mytest(@Req() req: Request) {
    return req.user;
  }

  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    return response.status(200);
  }
}
