import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

// {cors: '*'} pour que chaque client dans le frontend puisse se connecter à notre gateway
@WebSocketGateway({cors: '*'}) // decorator pour dire que la classe ChatGateway sera un gateway /
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

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

  // @SubscribeMessage('msgToServer')
  // HandleMessageToServer(@MessageBody() message: string): void {
  //   this.server.emit('msgToClient', message);
  // }

  @SubscribeMessage('msgToServer')
  HandleMessageToServer(@MessageBody() message: {sender: string, msg: string}): void {
    this.server.emit('msgToClient', message);
  }

  	/* ************************************************************************* */
	/*					Pour envoyer un message sur une room  					 */
	/* ************************************************************************* */

  @SubscribeMessage('chatToServer')
  HandleMessageToRoom(@MessageBody() message: {sender: string, room: string, msg: string}): void {
    this.server.to(message.room).emit('chatToClient', message);
  }

  	/* ************************************************************************* */
	/*							Pour rejoindre une room   						 */
	/* ************************************************************************* */

  @SubscribeMessage('joinRoom')
  HandleJoinRoom(client: Socket, room: string): void {
    client.join(room);
    client.emit('joinedRoom', room);
  }

  	/* ************************************************************************* */
	/*							Pour quitter une room   						 */
	/* ************************************************************************* */

  @SubscribeMessage('leaveRoom')
  HandleLeaveRoom(client: Socket, room: string): void {
    client.leave(room);
    client.emit('leftRoom', room);
  }

}