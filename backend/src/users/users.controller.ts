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
import { IUser, UsersEntity } from '../TypeOrm/Entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() post: IUser): Promise<IUser> {
    return await this.usersService.create(post);
  }
  @Get()
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.usersService.findAllUsers();
  }

  @Get(':login')
  async findOneBy(
    @Param('login') loginToFind: string,
  ): Promise<UsersEntity> {
    return await this.usersService.getByLogin(loginToFind);
  }
  @Get(':email')
  async getByEmail(@Param('email') emailToFind: string): Promise<UsersEntity> {
    return await this.usersService.getByEmail(emailToFind);
  }
  @Get(':id')
  async getById(@Param('id') idToFind: number): Promise<UsersEntity> {
    return await this.usersService.getById(idToFind);
  }

  @Put(':id/:status')
  async update(
    @Param('id') id: number,
    @Param('status') status: string,
  ): Promise<UsersEntity> {
    return await this.usersService.updateStatusUser(id, status);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<UsersEntity> {
    return await this.usersService.deleteUser(id);
  }
}
