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

	async getAllBlockUsers(): Promise<BlockUserEntity[]> {
		return await this.blockUserRepo.find({relations: ['user', 'blockBy']});
	}

	async getBlockUsers(id: number): Promise<UsersEntity[] | undefined> {
		const listUsers: UsersEntity[] = [];
		const user = (await this.usersService.getByIdWithRelations(id));
		if (user && user.blockUsers) {
			user.blockUsers.map(async blockUser => listUsers.push(blockUser.user));
			return listUsers;
		}
		else
			return undefined;
	}

	async getBlockBys(id: number): Promise<UsersEntity[] | undefined> {
		const listBys: UsersEntity[] = [];
		const user = (await this.usersService.getByIdWithRelations(id));
		if (user && user.blockBys) {
			user.blockBys.map(async blockBy => listBys.push(blockBy.blockBy));
			return listBys;
		}
		else
			return undefined;
	}

	async saveBlockUser(request: IBlockUser): Promise<BlockUserEntity> {
		const newrequest = await this.blockUserRepo.create(request);
		return await this.blockUserRepo.save(newrequest);
	}

	async removeblockUser(toDelete: BlockUserEntity): Promise<BlockUserEntity> {
		return await this.blockUserRepo.remove(toDelete);
	}
}