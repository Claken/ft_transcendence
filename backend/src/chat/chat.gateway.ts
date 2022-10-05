import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

// {cors: '*'} pour que chaque client dans le frontend puisse se connecter à notre gateway
@WebSocketGateway({cors: '*'}) // decorator pour dire que la classe ChatGateway sera un gateway /
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect { //

  private logger: Logger = new Logger('ChatGateway'); //

  @WebSocketServer() // decorator
  server: Server;

  afterInit(server: Server) {
    this.logger.log('Initialized!');
  }

  async handleConnection(client: Socket) {
    this.logger.log(`Client ${client.id} connected`);
  }

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client ${client.id} disconnected`);
  }

  @SubscribeMessage('everyone_message') // decorator pour indiquer quelle méthode envoyer pour l'évènement dont le nom correspond à 'messages'
  SendMessageToEveryone(client: Socket, text: string): void {
    this.server.emit('received', text);
  }

  @SubscribeMessage('msgToServer')
  HandleMessageToServer(@MessageBody() message: string): void {
    this.server.emit('msgToClient', message);
  }
}