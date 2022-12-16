import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { DmService } from 'src/dm/dm.service';
import { DmDto } from 'src/TypeOrm/DTOs/dm.dto';
import { IFriend } from 'src/TypeOrm/Entities/friend.entity';
import { IFriendRequest } from 'src/TypeOrm/Entities/friendRequest.entity';
import { UsersService } from 'src/users/users.service';
import { FriendRequestService } from './friendRequest.service';
import { PrivateRoomInviteService } from './privateRoomInvite.service'
import { PrivateRoomInviteEntity, IPInvite } from 'src/TypeOrm/Entities/privateRoomInvite';
import { OnEvent, EventEmitter2 } from '@nestjs/event-emitter';


@WebSocketGateway({ cors: '*:*' })
export class FriendRequestGateway {
  constructor(
		private readonly friendRequestService: FriendRequestService,
		private readonly usersService: UsersService,
		private readonly prInviteService: PrivateRoomInviteService,
		private dmService: DmService,
		private eventEmitter: EventEmitter2
		) {}

	@SubscribeMessage('send_friendRequest')
	async postFriendRequest(@MessageBody() request: DmDto) {
		const sender = this.usersService.getByNameWithRelations(request.sender);
		const receiver = this.usersService.getByNameWithRelations(request.receiver);
		const alreadyExist = this.friendRequestService.alreadyExist((await sender).id, (await receiver).id);
		if ((await alreadyExist) === undefined)
		{
			const newFriendRequest: IFriendRequest = {sender: (await sender), receiver: (await receiver)};
			const pushFriendRequest = this.friendRequestService.postFriendRequest(newFriendRequest);
			(await sender).friendRequests.push(await pushFriendRequest);
			(await receiver).friendRequests.push(await pushFriendRequest);
			await this.usersService.save(sender);
			await this.usersService.save(receiver);
			this.dmService.dmUsers.find(user => user.name === request.receiver).socket.emit('send_friendRequest');
		}
	}

	@SubscribeMessage('accept_friendRequest')
  async acceptFriendRequest(@MessageBody() request: DmDto) {
		const sender = this.usersService.getByNameWithRelations(request.sender);
		const receiver = this.usersService.getByNameWithRelations(request.receiver);
		const toDelete = (await this.friendRequestService.getFriendRequestByUserId((await sender).id, (await receiver).id));
		if (toDelete !== undefined) {
			let i = (await sender).friendRequests.findIndex(friendRequest => friendRequest.id === toDelete.id);
			(await sender).friendRequests.splice(i, 1);
			i = (await receiver).friendRequests.findIndex(friendRequest => friendRequest.id === toDelete.id);
			(await receiver).friendRequests.splice(i, 1);
			await this.friendRequestService.remove(toDelete);
			const senderFriend: IFriend = { user: await sender, friendOf: await receiver };
			const receiverFriend : IFriend = { user: await receiver, friendOf: await sender };
			const pushSenderFriend = this.friendRequestService.createNewFriend(senderFriend);
			const pushReceiverFriend = this.friendRequestService.createNewFriend(receiverFriend);
			(await sender).friends.push(await pushReceiverFriend);
			(await receiver).friends.push(await pushSenderFriend);
			await this.usersService.save(sender);
			await this.usersService.save(receiver);
		}
		this.dmService.dmUsers.find(user => user.name === request.sender).socket.emit('accept_friendRequest');
		this.dmService.dmUsers.find(user => user.name === request.receiver).socket.emit('accept_friendRequest');
	}

	@SubscribeMessage('refuse_friendRequest')
	async refuseFriendRequest(@MessageBody() request: DmDto) {
		const sender = this.usersService.getByNameWithRelations(request.sender);
		const receiver = this.usersService.getByNameWithRelations(request.receiver);
		const toDelete = (await this.friendRequestService.getFriendRequestByUserId((await sender).id, (await receiver).id));
		if (toDelete !== undefined) {
			let i = (await sender).friendRequests.findIndex(friendRequest => friendRequest.id === toDelete.id);
			(await sender).friendRequests.splice(i, 1);
			i = (await receiver).friendRequests.findIndex(friendRequest => friendRequest.id === toDelete.id);
			(await receiver).friendRequests.splice(i, 1);
			await this.friendRequestService.remove(toDelete);
			await this.usersService.save(sender);
			await this.usersService.save(receiver);
		}
		this.dmService.dmUsers.find(user => user.name === request.sender).socket.emit('refuse_friendRequest');
		this.dmService.dmUsers.find(user => user.name === request.receiver).socket.emit('refuse_friendRequest');
	}

	@OnEvent('delete_friend')
	@SubscribeMessage('delete_friend')
	async deleteFriend(@MessageBody() request: DmDto): Promise<void> {
		const sender = this.usersService.getByNameWithRelations(request.sender);
		const receiver = this.usersService.getByNameWithRelations(request.receiver);
		const senderFriend = (await sender).friends.find(friend => friend.user.name === request.receiver);
		let i = (await sender).friends.findIndex(friend => friend.user.name === request.receiver);
		(await sender).friends.splice(i, 1);
		const receiverFriend = (await receiver).friends.find(friend => friend.user.name === request.sender);
		i = (await receiver).friends.findIndex(friend => friend.user.name === request.sender);
		(await receiver).friends.splice(i, 1);
		await this.friendRequestService.deleteFriend(senderFriend);
		await this.friendRequestService.deleteFriend(receiverFriend);
		await this.usersService.save(sender);
		await this.usersService.save(receiver);
		this.dmService.dmUsers.find(user => user.name === request.sender).socket.emit('delete_friend');
		this.dmService.dmUsers.find(user => user.name === request.receiver).socket.emit('delete_friend');
	}

	@OnEvent('sendPrivateRoomInvite')
	async postPrInvite(@MessageBody() request: DmDto)
	{
		const sender = await this.usersService.getByNameWithRelations(request.sender);
		const receiver = await this.usersService.getByNameWithRelations(request.receiver);
		if (!await this.prInviteService.alreadyExist(sender.id, receiver.id, request.message))
		{
			const inviteCreated = await this.prInviteService.postPrInvite({sender: sender, receiver: receiver, privateRoom: request.message});
			sender.privateRoomInvites.push(inviteCreated);
			await this.usersService.updateUser(sender.id);
			receiver.privateRoomInvites.push(inviteCreated);
			await this.usersService.updateUser(receiver.id);
			this.dmService.dmUsers.find(user =>
				user.name === request.receiver).socket.emit('recvPrivateRoomInvite');
		}
	}

	@SubscribeMessage('refusePrivateRoomInvite')
	async refusePrInvite(@MessageBody() request: DmDto)
	{
		await this.deletePrInviteThenEmit(request);
	}

	@SubscribeMessage('acceptPrivateRoomInvite')
	async acceptPrInvite(@MessageBody() request: DmDto)
	{
		await this.deletePrInviteThenEmit(request);
	  	this.eventEmitter.emit('joinPrivateRoom', {user: request.receiver, channel: request.message});
	}

	async deletePrInviteThenEmit(request: DmDto)
	{
		const sender = await this.usersService.getByNameWithRelations(request.sender);
		const receiver = await this.usersService.getByNameWithRelations(request.receiver);

		const toDelete = await this.prInviteService.getPrInviteByUsersId(sender.id, receiver.id);

		let i = sender.privateRoomInvites.findIndex(prInvite => prInvite.id === toDelete.id);
		sender.privateRoomInvites.splice(i, 1);
		i = receiver.privateRoomInvites.findIndex(prInvite => prInvite.id === toDelete.id);
		receiver.privateRoomInvites.splice(i, 1);

		await this.prInviteService.deletePrInviteById(toDelete.id);
	
		await this.usersService.updateUser(sender.id);	
		await this.usersService.updateUser(receiver.id);

		this.dmService.dmUsers.find(user =>
			user.name === request.sender).socket.emit('updatePrInvites');
		this.dmService.dmUsers.find(user =>
			user.name === request.receiver).socket.emit('updatePrInvites');
	}
}
