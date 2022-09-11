import { Controller, Get, Post, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { CreateUserDto } from 'src/users/dto/createUser.dto';
import { AuthService } from './auth.service';
import { FortyTwoAuthGuard } from './fortytwo.authguard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  /**
   *
   * @param request this is the route the user will visit to authenticate
   * @param response
   * @returns
   */
  @Get('login')
  @UseGuards(FortyTwoAuthGuard)
  login() {
    return ;
  }

  /**
   *
   * @param req this is the redirect URL the OAuth2 Provider will call
   * @param res
   * @returns
   */
  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  redirect(@Res() res: Response) {
    res.send(200);
  }
  /**
   *
   * @param request destroy Session Log out
   * @param response
   * @returns
   */
  @UseGuards()
  @Get('logout')
  async logout(@Req() request: Request, @Res() response: Response) {
    return response.status(200);
  }
}
