import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: '*' })
export class AuthGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Auth Server Initialized');
  }

  async handleConnection(client: Socket) {}

  async handleDisconnect(client: Socket) {}

  @SubscribeMessage('getUser')
  Login(client: Socket) {}
}
