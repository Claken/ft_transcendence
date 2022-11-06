import { ConfigService } from '@nestjs/config';
import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { authenticator } from 'otplib';
import { toBuffer, toCanvas, toDataURL, toString } from 'qrcode';
import { Server, Socket } from 'socket.io';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthenticationService } from './two-factor-authentication/two-factor-authentication.service';

@WebSocketGateway({ cors: '*' })
export class AuthGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly usersService: UsersService,
    private readonly twoFAService: TwoFactorAuthenticationService,
    private readonly configService: ConfigService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {}

  async handleConnection(client: Socket) {}

  async handleDisconnect(client: Socket) {}

  @SubscribeMessage('generate-2fa')
  async generate2fa(client: Socket, user: UserDTO) {
    if (user.isTwoFAEnabled) {
      const { otpauthUrl } = await this.twoFAService.generateTwoFASecret(user);
      this.server.emit('twofa-generated', otpauthUrl);
    }
    else
      this.server.emit('twofa-generated', null);
  }

  @SubscribeMessage('toggle-2fa')
  async toggle2fa(client: Socket, user: UserDTO) {
    await this.usersService.turnOnOffTwoFA(user.id);
    const newUser = await this.usersService.getById(user.id);
    console.log(newUser.isTwoFAEnabled);
    this.server.emit('twofa-toggled', newUser);
  }

  @SubscribeMessage('setFirst-2fa')
  async setFirstTwoFa(client: Socket, user: UserDTO) {
    const otpauthUrl = authenticator.keyuri(
      user.name,
      this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
      user.twoFASecret,
    );
    this.server.emit('first-2fa-set', otpauthUrl);
  }
}
