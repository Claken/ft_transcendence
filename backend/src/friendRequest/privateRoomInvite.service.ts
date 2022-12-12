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

	async getAllPrivateInvites(): Promise<PrivateRoomInviteEntity[]> {
		return await this.prInviteRepo.find({relations: ['sender', 'receiver']});		
	}

	async postPrInvite(prInvite: IPInvite): Promise<PrivateRoomInviteEntity>
	{
		const newPrInvite = this.prInviteRepo.create(prInvite);
		return await this.prInviteRepo.save(newPrInvite);
	}

	async deleteInvite(toDelete: PrivateRoomInviteEntity): Promise<void>
	{
		await this.prInviteRepo.remove(toDelete);
	}
}
