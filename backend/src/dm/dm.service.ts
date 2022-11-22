import { Injectable, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DmDto } from '../TypeOrm/DTOs/dm.dto';
import { DmEntity } from '../TypeOrm/Entities/dm.entity';
import { Socket } from 'socket.io';

export class DmUser {
	name: string;
	socket: Socket;
};

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmEntity)
		private readonly dmRepo: Repository<DmEntity>,
		private readonly dmUsers: Array<DmUser>
  ) {}

	joinDm(socket: Socket, dm: DmDto) {
		const newDmUser: DmUser = {name: dm.sender, socket: socket};
		const i = this.dmUsers.findIndex(dmUser => dmUser.name === dm.sender)
		if (i >= 0) {
			this.dmUsers.splice(i, 1);
		}
		this.dmUsers.push(newDmUser);
	}

  async newDm(dm: DmDto) {
    const newDm = this.dmRepo.create(dm);
		if (this.dmUsers.find(dmUser => dmUser.name === dm.sender) !== undefined)
			this.dmUsers.find(dmUser => dmUser.name === dm.sender).socket.emit('message_dm', dm)
		if (this.dmUsers.find(dmUser => dmUser.name === dm.receiver) !== undefined)
			this.dmUsers.find(dmUser => dmUser.name === dm.receiver).socket.emit('message_dm', dm)
    return await this.dmRepo.save(newDm);
  }

	async historyDm(): Promise<DmEntity[]> {
    return await this.dmRepo.find();
  }

	async getByName(me: string, target: string): Promise<DmEntity[]> {
    return await this.dmRepo.find({
			where: [
				{sender: me, receiver: target},
				{sender: target, receiver: me},
			]
		});
  }

	async readDm(dm: DmDto): Promise<DmEntity[]> {
		const dms = await this.dmRepo.find({
			where: [
				{sender: dm.receiver, receiver: dm.sender, read: false},
			]
		});
		dms.map(dm => dm.read = true);
		return await this.dmRepo.save([...dms]);
	}

	async getRead(me: string, target: string): Promise<number> {
		return await this.dmRepo.count({
			where: {sender: target, receiver: me, read: false}
		});
	}
}
