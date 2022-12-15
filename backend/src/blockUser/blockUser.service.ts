import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockUserEntity} from "../TypeOrm/Entities/blockUser.entity";
import { IBlockUser } from "../TypeOrm/Entities/blockUser.entity";
import { UsersService } from 'src/users/users.service';
import { UsersEntity } from 'src/TypeOrm';

@Injectable()
export class BlockUserService {
  constructor(
  @InjectRepository(BlockUserEntity)
	private readonly blockUserRepo: Repository<BlockUserEntity>,
	private readonly usersService: UsersService
	) {}

	async getBlockUsers(name: string): Promise<UsersEntity[] | undefined> {
		const listUsers: UsersEntity[] = [];
		const user = (await this.usersService.getByNameWithRelations(name));
		if (user && user.blockUsers) {
			(await user).blockUsers.map(async blockUser => listUsers.push(blockUser.user));
			return listUsers;
		}
		else
			return undefined;
	}

	async getBlockBys(name: string): Promise<UsersEntity[] | undefined> {
		const listBys: UsersEntity[] = undefined;
		const user = (await this.usersService.getByNameWithRelations(name));
		if (user && user.blockBys) {
			(await user).blockBys.map(async blockBy => listBys.push(blockBy.user));
			return listBys;
		}
		else
			return undefined;
	}

	async saveBlockUser(request: IBlockUser): Promise<BlockUserEntity> {
		const newrequest = await this.blockUserRepo.create(request);
		return await this.blockUserRepo.save(newrequest);
	}

	async removeblockUser(id: number): Promise<BlockUserEntity> {
		const newrequest = await this.blockUserRepo.findOne({ relations: ['user'], where: { user: { id: id }}});
		return await this.blockUserRepo.remove(newrequest);
	}
}