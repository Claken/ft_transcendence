import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PrivateRoomInviteEntity, IPInvite} from 'src/TypeOrm/Entities/privateRoomInvite';

@Injectable()
export class PrivateRoomInviteService {
	constructor(
		@InjectRepository(PrivateRoomInviteEntity)
		private readonly prInviteRepo: Repository<PrivateRoomInviteEntity>,
	) {}

	async getAllPrInvites(): Promise<PrivateRoomInviteEntity[]> {
		return await this.prInviteRepo.find({relations: ['sender', 'receiver']});
	}

	async getPrInvitesFromOne(id: number): Promise<PrivateRoomInviteEntity[]>
	{
		return await this.prInviteRepo.find({relations: ['sender', 'receiver'], where: [{ receiver: { id: id }},]});
	}

	async getPrInviteByUsersId(senderId: number, receiverId: number): Promise<PrivateRoomInviteEntity> {
		return await this.prInviteRepo.findOne({
			relations: ['sender', 'receiver'], where: [{ sender: { id: senderId }, receiver: { id: receiverId }}]
		});
	}

	async postPrInvite(prInvite: IPInvite): Promise<PrivateRoomInviteEntity>
	{
		const newPrInvite = this.prInviteRepo.create(prInvite);
		return await this.prInviteRepo.save(newPrInvite);
	}

	async alreadyExist(senderId: number, receiverId: number, channel: string): Promise<PrivateRoomInviteEntity>
	{
		return await this.prInviteRepo.findOne({relations: ['sender','receiver'], where: [
				{ sender: { id: senderId }, receiver: { id: receiverId }},
				{ sender: { id: receiverId }, receiver: { id: senderId }},
				{ privateRoom: channel}
			]
		});
	}

	async deletePrInvite(toDelete: PrivateRoomInviteEntity): Promise<void>
	{
		await this.prInviteRepo.remove(toDelete);
	}

	async deletePrInviteById(prInviteId: number): Promise<void>
	{
		await this.prInviteRepo.delete({id: prInviteId});
	}
}
