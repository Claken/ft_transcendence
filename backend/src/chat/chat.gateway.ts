import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway() // decorator pour dire que la classe ChatGateway sera un gateway
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

  afterInit(server: any) {
    
  }

  handleConnection(client: any, ...args: any[]) {
    
  }

  handleDisconnect(client: any) {
    
  }

  @WebSocketServer() // decorator
  server: Server;

  @SubscribeMessage('message') // decorator pour indiquer quelle méthode envoyer pour l'évènement dont le nom correspond à 'messages'
  handleMessage(client: any, payload: any): string {
    return 'Hello world!';
  }
}
