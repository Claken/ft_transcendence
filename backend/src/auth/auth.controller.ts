import { Controller, Get, Redirect, Req, Res, UseGuards } from '@nestjs/common';
import { Request, Response } from 'express';
import { IUser } from 'src/TypeOrm/Entities/users.entity';
import { UsersService } from 'src/users/users.service';
import { FortyTwoAuthGuard } from './guards/fortytwo.guard';

@Controller('auth/42')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('login')
  register(@Req() req: Request) {
    return req.user;
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  @Redirect('http://localhost:3000')
  login(@Req() req: Request) {
    if (req.user) {
      const { id } = req.user as IUser;
      this.usersService.updateStatusUser(id, 'online');
    }
    return req.user;
  }

  @Get('logout')
  @Redirect('http://localhost:3000')
  async logOut(@Req() req: Request) {
    // logOut() => removes the session from the memory of the webserver
    if (req.user) {
      const { id } = req.user as IUser;
      this.usersService.updateStatusUser(id, 'offline');
      req.logOut((err) => {
        console.log(err);
      }); // without the callback an error occured...
      // set maxAge to 0 remove the cookie from the browser
      req.session.cookie.maxAge = 0;
    }
  }
}
