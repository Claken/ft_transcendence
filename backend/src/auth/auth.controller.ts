import {
  Controller,
  Get,
  Put,
  Query,
  Redirect,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { FortyTwoAuthGuard } from './guards/fortytwo.guard';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './guards/jwt.guard';
import { IUser } from 'src/TypeOrm/Entities/users.entity';

@Controller('auth/42')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('login')
  register(@Req() req: Request) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  @Redirect('/auth/42/test')
  async login(@Req() req: Request) {
    return await this.authService.login(req.user as IUser);
  }

  @UseGuards(JwtAuthGuard)
  @Get('test')
  mytest(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(JwtAuthGuard)
  @Get('logout')
  async logout(@Req() req: Request, @Res() response: Response) {
    await this.authService.logout(req.user as IUser);
  }
}
