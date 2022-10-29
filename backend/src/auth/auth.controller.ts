import { Controller, Get, Redirect, Req, UseGuards } from '@nestjs/common';
import { Request } from 'express';
import { RequestWithUser, UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';
import { FortyTwoAuthGuard } from './guards/fortytwo.guard';

@Controller('auth/42')
export class AuthController {
  constructor(private usersService: UsersService) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('login')
  register(@Req() req: RequestWithUser) {
    return req.user;
  }

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  @Redirect('http://localhost:3000')
  login(@Req() req: RequestWithUser) {
    if (req.user) {
      this.usersService.updateStatusUser(req.user.id, 'online');
    }
    return req.user;
  }

  @Get('logout')
  @Redirect('http://localhost:3000')
  async logOut(@Req() req: RequestWithUser) {
    // logOut() => removes the session from the memory of the webserver
    if (req.user) {
      this.usersService.updateStatusUser(req.user.id, 'offline');
      req.logOut((err) => {
        console.log(err);
      }); // without the callback an error occured...
      // set maxAge to 0 remove the cookie from the browser
      req.session.cookie.maxAge = 0;
    }
  }
}
