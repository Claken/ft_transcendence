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
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: '*:*' })
export class BlockUserGateway {
  constructor(
		private readonly blockUserService: BlockUserService,
		private readonly usersService: UsersService,
		private readonly dmService: DmService,
    private eventEmitter: EventEmitter2,
		) {}

	@SubscribeMessage('block_user')
  async blockNewUser(@MessageBody() request: BlockUserDto) {
		const sender = this.usersService.getByIdWithRelations(request.sender);
		const blockUser = this.usersService.getByIdWithRelations(request.blocked);
		const name = (await blockUser).name;
		const requestBlock: IBlockUser = {user: await blockUser, blockBy: await sender};
		const newRequestBlock = this.blockUserService.saveBlockUser(requestBlock);
		(await blockUser).blockBys.push(await newRequestBlock);
		(await sender).blockUsers.push(await newRequestBlock);
		await this.usersService.save(sender);
		await this.usersService.save(blockUser);
		if ((await sender).friends.findIndex(friend => friend.user.id === request.blocked) > -1)
			await this.eventEmitter.emit('delete_friend', { sender: (await sender).name, receiver: (await blockUser).name});
		this.dmService.dmUsers.find(async dmUser => dmUser.name === (await blockUser).name).socket.emit('block_user');
		this.dmService.dmUsers.find(async dmUser => dmUser.name === (await sender).name).socket.emit('block_user');
		console.log("we blocked", name);
  }

	@SubscribeMessage('deblock_user')
  async deBlockUser(@MessageBody() request: BlockUserDto) {
		const sender = this.usersService.getByIdWithRelations(request.sender);
		const deblockUser = this.usersService.getByIdWithRelations(request.blocked);
		let i = (await sender).blockUsers.findIndex(async blockUser => blockUser.user.id === (await deblockUser).id);
		(await sender).blockUsers.splice(i, 1);
		i = (await deblockUser).blockBys.findIndex(async blockBy => blockBy.blockBy.id === (await sender).id);
		(await deblockUser).blockBys.splice(i, 1);
		await this.blockUserService.removeblockUser((await deblockUser).id);
		await this.usersService.save(sender);
		await this.usersService.save(deblockUser);
		this.dmService.dmUsers.find(async dmUser => dmUser.name === (await deblockUser).name).socket.emit('deblock_user');
		this.dmService.dmUsers.find(async dmUser => dmUser.name === (await sender).name).socket.emit('deblock_user');
	}
}