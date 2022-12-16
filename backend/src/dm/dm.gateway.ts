import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
	ConnectedSocket,
} from '@nestjs/websockets';
import { Socket } from 'socket.io'
import { DmDto } from '../TypeOrm/DTOs/dm.dto';
import { DmService } from './dm.service';
import { OnEvent } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: '*:*' })
export class DmGateway {
  constructor(
    private readonly dmService: DmService,
    // private eventEmitter: EventEmitter2,
    ) {}

  @SubscribeMessage('join_dm')
  async joinDm(@ConnectedSocket() socket: Socket, @MessageBody() dm: DmDto) {
		this.dmService.joinDm(socket, dm);
  }

  @OnEvent('modify_name_dm')
  @SubscribeMessage('modify_name_dm')
  async modifyName(@MessageBody() dm: DmDto) {
		this.dmService.modifyName(dm);
  }

  @SubscribeMessage('message_dm')
  async newDm(@MessageBody() dm: DmDto) {
		await this.dmService.newDm(dm);
  }

	@SubscribeMessage('read_dm')
  async readDm(@MessageBody() dm: DmDto) {
		await this.dmService.readDm(dm);
	}
}
