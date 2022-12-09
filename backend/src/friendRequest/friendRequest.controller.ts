import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { FriendRequestEntity, IFriendRequest } from '../TypeOrm/Entities/friendRequest.entity';
import { FriendRequestService } from './friendRequest.service';
import { UsersService } from '../users/users.service';
import { UsersEntity } from 'src/TypeOrm';
import { DmService } from 'src/dm/dm.service';

@Controller('friendRequest')
export class FriendRequestController {
	constructor(
		private readonly friendRequestService: FriendRequestService,
		) {}

	@Get()
	async getAllFriendRequests(): Promise<FriendRequestEntity[]> {
    return await this.friendRequestService.getAllFriendRequests();
	}

	@Get(':id')
	async getFriendRequestsOfOne(@Param('id') id: number): Promise<UsersEntity[]> {
		const friendRequests = this.friendRequestService.getFriendRequestsOfOne(id);
		const senders: UsersEntity[] = [];
		(await friendRequests).map(friendRequest => senders.push(friendRequest.sender));
		return senders;
	}
}
