import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';

@WebSocketGateway({ cors: '*' })
export class AuthGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor() {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
  }

  async handleConnection(client: Socket) {}

  async handleDisconnect(client: Socket) {}

  // @SubscribeMessage('sendUser')
  // Login(client: Socket, user) {
  //   console.log(user);
  //   console.log('Imhere!')
  // }

  @SubscribeMessage('generate-2fa')
  Login(client: Socket, user: UserDTO) {
    console.log('Imhere!')
  }
}
