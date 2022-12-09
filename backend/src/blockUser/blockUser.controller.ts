import { Get, Param, Controller } from '@nestjs/common';
import { UsersEntity } from '../TypeOrm/Entities/users.entity';
import { BlockUserService } from './blockUser.service';

@Controller('blockUser')
export class BlockUserController {
	constructor(private readonly BlockUserService: BlockUserService) {}

	@Get(':name/blockUsers')
	async getBlockUsers(@Param('name') name: string): Promise<UsersEntity[] | undefined> {
    return await this.BlockUserService.getBlockUsers(name);
  }

	@Get(':name/blockBys')
	async getBlockBys(@Param('name') name: string): Promise<UsersEntity[] | undefined> {
		return await this.BlockUserService.getBlockBys(name);
	}
}