import {
  Body,
  Controller,
  Get,
  HttpStatus,
  ParseFilePipeBuilder,
  Patch,
  Post,
  Redirect,
  Req,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request, Response } from 'express';
import { RequestWithUser, UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';
import { FortyTwoAuthGuard } from './guards/fortytwo.guard';
import { diskStorage } from 'multer';
import { extname } from 'path';

@Controller('auth/42')
export class AuthController {
  constructor(private usersService: UsersService) {}

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
    if (isTwoFAEnabled) res.redirect('http://localhost:3000/twofa');
    else res.redirect('http://localhost:3000');
    return req.user;
  }

  @Post('upload')
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: diskStorage({
        destination: './src/avatarUploads',
        filename: (req: RequestWithUser, file, cb) => {
          // Calling the callback passing the
          // originalname created in frontend
          console.log(file);
          cb(null, `${(file.originalname)}`);
        },
      }),
    }),
  )
  async uploadFile(
    @UploadedFile(
      new ParseFilePipeBuilder()
        .addFileTypeValidator({
          fileType: /(jpe?g|png|gif|bmp)$/,
        })
        .addMaxSizeValidator({
          maxSize: 1000000, //1mo
        })
        .build({
          errorHttpStatusCode: HttpStatus.UNPROCESSABLE_ENTITY,
        }),
    )
    file: Express.Multer.File,
  ): Promise<UserDTO> {
    // file.name = user.name+10randomNb
    const len = file.filename.length - 10;
    const username = file.filename.substring(0, len);
    let user = await this.usersService.getByName(username);
    // update user => AvatarUrl
    user = await this.usersService.updateAvatarUrl(user.id, "/mnt/nfs/homes/aderose/Documents/cursus/project_ft_transcendence/ft_transcendence/backend/"+file.path);
    console.log(file);
    console.log(user.avatarUrl);
    return user;
  }

  @Get('logout')
  @Redirect('http://localhost:3000')
  async logOut(@Req() req: RequestWithUser) {
    // logOut() => removes the session from the memory of the webserver
    if (req.user) {
      this.usersService.updateStatusUser(req.user.id, 'offline');
      if (req.user.isTwoFAValidated)
        this.usersService.setTwoFACertif(req.user.id, false);
      req.logOut((err) => {
        if (err) console.log(err);
      }); // without the callback an error occured...
      // set maxAge to 0 remove the cookie from the browser
      req.session.cookie.maxAge = 0;
    }
  }
}
