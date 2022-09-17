import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway() // decorator pour dire que la classe ChatGateway sera un gateway
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect { //

  private logger: Logger = new Logger('ChatGateway'); //

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client ${client.id} connected`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @WebSocketServer() // decorator
  server: Server;

  @SubscribeMessage('everyone_message') // decorator pour indiquer quelle méthode envoyer pour l'évènement dont le nom correspond à 'messages'
  SendMessageToEveryone(client: Socket, text: string): void {
    this.server.emit('received', text);
  }

  @SubscribeMessage('MsgToServer')
  HandleMessageToServer(client: Socket, text: string): WsResponse<string> {
    return {event: 'MsgToClient', data: text};
  }
}