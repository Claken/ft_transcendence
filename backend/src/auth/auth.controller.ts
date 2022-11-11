import { Controller, Get, Post, Redirect, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { RequestWithUser } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';
import { FortyTwoAuthGuard } from './guards/fortytwo.guard';

@Controller('auth/42')
export class AuthController {
  constructor(
    private usersService: UsersService,
  ) {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('login')
  register() {}

  @UseGuards(FortyTwoAuthGuard)
  @Get('callback')
  @Redirect('verify2fa')
  login(@Req() req: RequestWithUser) {
    if (req.user) {
      this.usersService.updateStatusUser(req.user.id, 'online');
    }
    return req.user;
  }

  @Get('verify2fa')
  verify2fa(@Req() req: RequestWithUser, @Res() res: Response) {
    const { isTwoFAEnabled } = req.user;
    if (isTwoFAEnabled)
      res.redirect('http://localhost:3000/twofa')
    else
      res.redirect('http://localhost:3000')
    return req.user;
  }

  // @Post('upload')
  // @UseInterceptors(FileInterceptor('avatar', {limits: { fileSize: 2500000}})) //TODO: 2mo
  // uploadFile(@UploadedFile() file: Express.Multer.File) {
  //   console.log(file);
  // }

  @Get('logout')
  @Redirect('http://localhost:3000')
  async logOut(@Req() req: RequestWithUser) {
    // logOut() => removes the session from the memory of the webserver
    if (req.user) {
      this.usersService.updateStatusUser(req.user.id, 'offline');
      if (req.user.isTwoFAValidated)
        this.usersService.setTwoFACertif(req.user.id, false);
      req.logOut((err) => {
        if (err)
          console.log(err);
        else
          console.log("Delete UserSessionCookie");
      }); // without the callback an error occured...
      // set maxAge to 0 remove the cookie from the browser
      req.session.cookie.maxAge = 0;
    }
  }
}
