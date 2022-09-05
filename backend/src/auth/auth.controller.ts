import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { Observable } from 'rxjs';
import { DeleteResult, UpdateResult } from 'typeorm';
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

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() authPost: AuthPost,
  ): Observable<UpdateResult> {
    return this.authService.updateUser(id, authPost);
  }

  @Delete(':id')
  delete(@Param('id') id: number): Observable<DeleteResult> {
    return this.authService.deleteUser(id);
  }
}
