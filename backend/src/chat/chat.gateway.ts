import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway() // decorator pour dire que la classe ChatGateway sera un gateway
export class ChatGateway {
  @WebSocketServer()
  server: Server;
  @SubscribeMessage('message') // decorator pour indiquer la classe en dessous s'occupe de recevoir des messages ?
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
