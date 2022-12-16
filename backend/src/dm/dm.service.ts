import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DmDto } from '../TypeOrm/DTOs/dm.dto';
import { DmEntity } from '../TypeOrm/Entities/dm.entity';
import { Socket } from 'socket.io';
import { userQueue } from 'src/game/game.gateway';

export class DmUser {
	name: string;
	socket: Socket;
};

@Injectable()
export class DmService {
  constructor(
    @InjectRepository(DmEntity)
		private readonly dmRepo: Repository<DmEntity>,
		readonly dmUsers: Array<DmUser>
  ) {}

	joinDm(socket: Socket, dm: DmDto) {
		const newDmUser: DmUser = {name: dm.sender, socket: socket};
		const i = this.dmUsers.findIndex(dmUser => dmUser.name === dm.sender)
		if (i >= 0 && this.dmUsers[i].socket !== socket) {
			this.dmUsers[i].socket = socket;
			this.dmUsers.find(user => user.name === dm.sender).socket.emit('block_user');
			return;
		}
		const j = this.dmUsers.findIndex(dmUser => dmUser.socket === socket)
		if (j >= 0 && this.dmUsers[j].name !== dm.sender) {
			this.dmUsers[j].name = dm.sender;
			this.dmUsers.find(user => user.name === dm.sender).socket.emit('block_user');
			return;
		}
		else if (i === -1 && j === -1) {
			this.dmUsers.unshift(newDmUser);
			this.dmUsers.find(user => user.name === dm.sender).socket.emit('block_user');
		}
	}

	modifyName(dm: DmDto) {
		const i = this.dmUsers.findIndex(dmUser => dmUser.name === dm.receiver)
		if (i >= 0 && this.dmUsers[i].name !== dm.sender) {
			this.dmUsers[i].name = dm.sender;
		}
	}

	deleteName(client: Socket) {
		const i = this.dmUsers.findIndex(dmUser => dmUser.socket.id === client.id)
		if (i >= 0) {
			this.dmUsers.splice(i, 1);
		}
	}

  async newDm(dm: DmDto): Promise<DmEntity> {
    const newDm = this.dmRepo.create(dm);
		const returnDm = this.dmRepo.save(newDm);
		const pushDm = await this.dmRepo.findOne({ where: { id: (await returnDm).id }});
		if (this.dmUsers.find(dmUser => dmUser.name === dm.sender) !== undefined)
			this.dmUsers.find(dmUser => dmUser.name === dm.sender).socket.emit('message_dm', pushDm);
		if (this.dmUsers.find(dmUser => dmUser.name === dm.receiver) !== undefined)
			this.dmUsers.find(dmUser => dmUser.name === dm.receiver).socket.emit('message_dm', pushDm);
    return returnDm;
  }

	async historyDm(): Promise<DmEntity[]> {
    return await this.dmRepo.find();
  }

	async getByName(me: number, target: number): Promise<DmEntity[]> {
    return await this.dmRepo.find({
			where: [
				{senderId: me, receiverId: target},
				{senderId: target, receiverId: me},
			]
		});
  }

	async readDm(dm: DmDto): Promise<DmEntity[]> {
		const dms = await this.dmRepo.find({
			where: [
				{senderId: dm.receiverId, receiverId: dm.senderId, read: false},
			]
		});
		dms.map(dm => dm.read = true);
		return await this.dmRepo.save([...dms]);
	}

	async getRead(me: number, target: number): Promise<number> {
		return await this.dmRepo.count({
			where: {senderId: target, receiverId: me, read: false}
		});
	}

	sendSocket(who: string, message: string) {
		this.dmUsers.find(dmUser => dmUser.name === who).socket.emit(message)
	}
}
