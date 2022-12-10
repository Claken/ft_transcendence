import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersEntity } from '../TypeOrm/Entities/users.entity';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { FriendEntity } from 'src/TypeOrm';

@Controller('users')
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post()
  async create(@Body() post: UserDTO): Promise<UsersEntity> {
    return await this.usersService.create(post, null);
  }

  @Get()
  async findAllUsers(): Promise<UsersEntity[]> {
    return await this.usersService.findAllUsers();
  }
  
  @Get('name/:name')
  async findOneBy(@Param('name') nameToFind: string): Promise<UsersEntity> {
    return await this.usersService.getByName(nameToFind);
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

	@Get(':name/friends')
	async getFriends(@Param('name') name: string): Promise<UsersEntity[] | undefined> {
		return await this.usersService.getFriends(name);
	}
}
