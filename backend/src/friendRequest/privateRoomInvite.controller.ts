import { Controller, Get, Post, Put, Body, Param } from '@nestjs/common';
import { FriendRequestEntity, IFriendRequest } from '../TypeOrm/Entities/friendRequest.entity';
import {  } from './friendRequest.service';
import { UsersService } from '../users/users.service';
import { PrivateRoomInviteEntity, UsersEntity } from 'src/TypeOrm';
import { DmService } from 'src/dm/dm.service';
import { PrivateRoomInviteService } from './privateRoomInvite.service';

@Controller('privateRoomInvite')
export class PrivateRoomInviteController {
	constructor(
		private readonly prInviteService: PrivateRoomInviteService,
		) {}

	@Get()
	async getAllPrInvites(): Promise<PrivateRoomInviteEntity[]> {
    return await this.prInviteService.getAllPrInvites();
	}

	@Get(':id')
	async getPrInvitesFromOne(@Param('id') id: number): Promise<{user: string, channel: string}[]> {
		const prInvites = await this.prInviteService.getPrInvitesFromOne(id);
		const senders: {user: string, channel: string}[] = [];
		prInvites.map(prInvite => senders.push({user: prInvite.sender.name, channel: prInvite.privateRoom}));
		return senders;
	}
}
