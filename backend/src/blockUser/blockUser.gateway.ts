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
import { FriendRequestService } from 'src/friendRequest/friendRequest.service';

@WebSocketGateway({ cors: '*:*' })
export class BlockUserGateway {
  constructor(
		private readonly blockUserService: BlockUserService,
		private readonly usersService: UsersService,
		private readonly dmService: DmService,
		private readonly friendRequestService: FriendRequestService,
    private eventEmitter: EventEmitter2,
		) {}

	@SubscribeMessage('block_user')
  async blockNewUser(@MessageBody() request: BlockUserDto) {
		const sender = this.usersService.getByIdWithRelations(request.sender);
		const blockUser = this.usersService.getByIdWithRelations(request.blocked);
		const names = (await sender).name;
		const nameb = (await blockUser).name;
		const requestBlock: IBlockUser = {user: await blockUser, blockBy: await sender};
		const newRequestBlock = this.blockUserService.saveBlockUser(requestBlock);
		(await sender).blockUsers.push(await newRequestBlock);
		(await blockUser).blockBys.push(await newRequestBlock);
		await this.usersService.save(sender);
		await this.usersService.save(blockUser);
		const exist = await this.friendRequestService.alreadyExist(request.sender, request.blocked);
		if (exist !== undefined)
			await this.friendRequestService.remove(exist);
		if ((await sender).friends.findIndex(friend => friend.user.id === request.blocked) > -1)
			await this.eventEmitter.emit('delete_friend', { sender: (await sender).name, receiver: (await blockUser).name});
		this.dmService.dmUsers.find(dmUser => dmUser.name === names).socket.emit('block_user');
		this.dmService.dmUsers.find(dmUser => dmUser.name === nameb).socket.emit('block_user');
  }

	@SubscribeMessage('deblock_user')
  async deBlockUser(@MessageBody() request: BlockUserDto) {
		const sender = this.usersService.getByIdWithRelations(request.sender);
		const deblockUser = this.usersService.getByIdWithRelations(request.blocked);
		const names = (await sender).name;
		const nameb = (await deblockUser).name;
		const toDelete = (await sender).blockUsers.find(blockUser => blockUser.user.id === request.blocked && blockUser.blockBy.id === request.sender)
		if (toDelete !== undefined) {
			let i = (await sender).blockUsers.findIndex(blockUser => blockUser.id === toDelete.id);
			(await sender).blockUsers.splice(i, 1);
			i = (await deblockUser).blockBys.findIndex(blockBy => blockBy.id === toDelete.id);
			(await deblockUser).blockBys.splice(i, 1);
			await this.blockUserService.removeblockUser(toDelete);
			await this.usersService.save(sender);
			await this.usersService.save(deblockUser);
		}
		this.dmService.dmUsers.find(dmUser => dmUser.name === nameb).socket.emit('deblock_user');
		this.dmService.dmUsers.find(dmUser => dmUser.name === names).socket.emit('deblock_user');
	}
}