import { Controller, Get, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { RequestWithUser } from './TypeOrm/DTOs/User.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('me')
  getCookie(@Req() req: RequestWithUser) {
    return req.user;
  }
}
