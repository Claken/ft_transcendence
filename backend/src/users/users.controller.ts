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
import { UsersService } from './users.service';
import { UsersEntity } from './models/users.entity';
import { UsersPost } from './models/users.interface';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() post: UsersPost): Promise<UsersPost> {
    return await this.usersService.createUser(post);
  }
  @Get()
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.usersService.findAllUsers();
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() usersPost: UsersPost,
  ): Promise<UpdateResult> {
    return await this.usersService.updateUser(id, usersPost);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.usersService.deleteUser(id);
  }
}
