import { Controller, Get, Post, Req } from '@nestjs/common';
import { Request } from 'express';
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
  test(@Req() req: RequestWithUser) {
    return req.user;
  }
}
