import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';
import { DmDto } from '../TypeOrm/DTOs/dm.dto';
import { DmService } from './dm.service';

@WebSocketGateway({ cors: '*:*' })
export class DmGateway {
  @WebSocketServer()
  server;

  constructor(private readonly dmService: DmService) {}

  @SubscribeMessage('message_dm')
  async newMessage(@MessageBody() dm: DmDto) {
		const data = await this.dmService.newMessage(dm);
    this.server.emit('message_dm', dm);
		return data;
  }
}
