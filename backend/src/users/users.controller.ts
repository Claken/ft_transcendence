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
import { IUser, Users } from '../TypeOrm/Entities/users.entity';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() post: IUser): Promise<IUser> {
    return await this.usersService.create(post);
  }
  @Get()
  async findAllUsers(): Promise<Users[]> {
    return await this.usersService.findAllUsers();
  }

  @Get(':login')
  async findOneBy(@Param('login') loginToFind: string): Promise<Users> {
    return await this.usersService.getByLogin(loginToFind);
  }
  @Get(':email')
  async getByEmail(@Param('email') emailToFind: string): Promise<Users> {
    return await this.usersService.getByEmail(emailToFind);
  }
  @Get(':id')
  async getById(@Param('id') idToFind: number): Promise<Users> {
    return await this.usersService.getById(idToFind);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() user: IUser,
  ): Promise<UpdateResult> {
    return await this.usersService.updateUser(id, user);
  }

  @Delete(':id')
  async delete(@Param('id') id: number): Promise<DeleteResult> {
    return await this.usersService.deleteUser(id);
  }
}
