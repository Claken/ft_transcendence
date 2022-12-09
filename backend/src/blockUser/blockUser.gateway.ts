import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { BlockUserDto } from 'src/TypeOrm/DTOs/blockUser.dto';
import { IBlockUser } from 'src/TypeOrm/Entities/blockUser.entity';
import { UsersService } from 'src/users/users.service';
import { BlockUserService } from './blockUser.service';
import { DmService } from 'src/dm/dm.service';

@WebSocketGateway({ cors: '*:*' })
export class BlockUserGateway {
  constructor(
		private readonly blockUserService: BlockUserService,
		private readonly usersService: UsersService,
		private readonly dmService: DmService
		) {}

	@SubscribeMessage('block_user')
  async blockNewUser(@MessageBody() request: BlockUserDto) {
		const sender = this.usersService.getByIdWithRelations(request.sender);
		const blockUser = this.usersService.getByIdWithRelations(request.blocked);
		const requestBlock: IBlockUser = {user: await blockUser, blockBy: await sender};
		const newRequestBlock = this.blockUserService.saveBlockUser(requestBlock);
		(await blockUser).blockBys.push(await newRequestBlock);
		(await sender).blockUsers.push(await newRequestBlock)
		this.usersService.save(sender);
		this.usersService.save(blockUser);
		this.dmService.dmUsers.find(async dmUser => dmUser.name === (await blockUser).name).socket.emit('block_user');
		this.dmService.dmUsers.find(async dmUser => dmUser.name === (await sender).name).socket.emit('block_user');
  }

	@SubscribeMessage('deblock_user')
  async deBlockUser(@MessageBody() request: BlockUserDto) {
		const sender = this.usersService.getByIdWithRelations(request.sender);
		const deblockUser = this.usersService.getByIdWithRelations(request.blocked);
		let i = (await sender).blockUsers.findIndex(async blockUser => blockUser.blockBy === (await sender));
		(await sender).blockUsers.splice(i, 1);
		i = (await deblockUser).blockBys.findIndex(async blockBy => blockBy.user === (await deblockUser));
		(await deblockUser).blockBys.splice(i, 1);
		this.blockUserService.removeblockUser((await deblockUser).id);
	}
}