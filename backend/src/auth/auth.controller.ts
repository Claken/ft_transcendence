import { Body, Controller, Get, Post } from '@nestjs/common';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { AuthPost } from './models/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  create(@Body() post: AuthPost): Observable<AuthPost> {
    return this.authService.createUser(post);
  }
  @Get()
  findAllUsers(): Observable<AuthPost[]> {
    return this.authService.findAllUsers();
  }
}
