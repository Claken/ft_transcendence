import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
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
    return await this.usersService.create(post);
  }
  @Get()
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.usersService.findAllUsers();
  }

  @Get(':username')
  async findOneBy(
    @Param('username') usernameToFind: string,
  ): Promise<UsersEntity> {
    return await this.usersService.getByUsername(usernameToFind);
  }
  @Get(':email')
  async getByEmail(@Param('email') emailToFind: string): Promise<UsersEntity> {
    return await this.usersService.getByEmail(emailToFind);
  }
  @Get(':id')
  async getById(@Param('id') idToFind: number): Promise<UsersEntity> {
    return await this.usersService.getById(idToFind);
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
