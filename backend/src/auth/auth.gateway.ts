import { ParseIntPipe } from '@nestjs/common';
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
      const { otpauthUrl } = await this.twoFAService.generateTwoFASecret(user);
      this.server.emit('2fa-generated', otpauthUrl);
  }

  @SubscribeMessage('toggle-2fa')
  async toggle2fa(client: Socket, user: UserDTO) {
    await this.usersService.turnOnOffTwoFA(user.id);
    const newUser = await this.usersService.getById(user.id);
    if (newUser.isTwoFAEnabled && !newUser.twoFASecret) {
      this.generate2fa(client, user);
    }
    this.server.emit('twofa-toggled', newUser);
  }

  @SubscribeMessage('set-2fa-url')
  async setTwoFaUrl(client: Socket, user: UserDTO) {
    if (user.twoFASecret) {
      const otpauthUrl = authenticator.keyuri(
        user.name,
        this.configService.get('TWO_FACTOR_AUTHENTICATION_APP_NAME'),
        user.twoFASecret,
      );
      this.server.emit('2fa-url-set', otpauthUrl);
    }
    else
      this.server.emit('2fa-url-set', null);
  }

  @SubscribeMessage('check-secret-code')
  checkSecretCode(client: Socket, pair) {
      console.log(pair[0].isTwoFAEnabled+": "+pair[1]);
  }
}
