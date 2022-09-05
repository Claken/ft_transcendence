import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { DeleteResult, UpdateResult } from 'typeorm';
import { AuthService } from './auth.service';
import { AuthEntity } from './models/auth.entity';
import { AuthPost } from './models/auth.interface';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post()
  async create(@Body() post: AuthPost): Promise<AuthPost> {
    return await this.authService.createUser(post);
  }
  @Get()
  async findAllUsers(): Promise<AuthEntity[]> {
    return await this.authService.findAllUsers();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() authPost: AuthPost,
  ): Promise<UpdateResult> {
    return await this.authService.updateUser(id, authPost);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.authService.deleteUser(id);
  }
}
