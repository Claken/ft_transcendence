import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthPost } from './models/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  create(@Body() post: AuthPost) {
    return this.authService.createPost(post);
  }
}
