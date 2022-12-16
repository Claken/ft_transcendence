import { Get, Param, Controller } from '@nestjs/common';
import { BlockUserEntity } from 'src/TypeOrm';
import { UsersEntity } from '../TypeOrm/Entities/users.entity';
import { BlockUserService } from './blockUser.service';

@Controller('blockUser')
export class BlockUserController {
	constructor(private readonly BlockUserService: BlockUserService) {}

	@Get()
	async getAllBlockUsers(): Promise<BlockUserEntity[]> {
    return await this.BlockUserService.getAllBlockUsers();
	}

	@Get(':id/blockUsers')
	async getBlockUsers(@Param('id') id: number): Promise<UsersEntity[] | undefined> {
    return await this.BlockUserService.getBlockUsers(id);
  }

	@Get(':id/blockBys')
	async getBlockBys(@Param('id') id: number): Promise<UsersEntity[] | undefined> {
		return await this.BlockUserService.getBlockBys(id);
	}
}