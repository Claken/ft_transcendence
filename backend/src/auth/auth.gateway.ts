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
import { TwoFAValidation, UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthenticationService } from './two-factor-authentication/two-factor-authentication.service';

@WebSocketGateway({ cors: '*' })
export class AuthGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly usersService: UsersService,
    private readonly twoFAService: TwoFactorAuthenticationService,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {}

  async handleConnection(client: Socket) {}

  async handleDisconnect(client: Socket) {}

  /* ********************************************************* */
	/*                     Account.tsx                           */
	/* ********************************************************* */
  @SubscribeMessage('set-2fa-url')
  set2faUrl(client: Socket, user: UserDTO) {
    const otpauthUrl = this.twoFAService.setOtpauthUrl(user.name, user.twoFASecret);
    this.server.emit('2fa-url-set', otpauthUrl);
  }

  @SubscribeMessage('generate-2fa')
  async generate2fa(client: Socket, user: UserDTO) {
    const { secret, otpauthUrl } = await this.twoFAService.generateTwoFASecret(user);
    user.twoFASecret = secret
    this.set2faUrl(client, user);
    this.server.emit('maj-user-2fa', user);
  }

  @SubscribeMessage('toggle-2fa')
  async toggle2fa(client: Socket, user: UserDTO) {
    await this.usersService.turnOnOffTwoFA(user.id);
    const newUser = await this.usersService.getById(user.id);
    if (newUser.isTwoFAEnabled) {
      if (!newUser.twoFASecret)
        await this.generate2fa(client, newUser);
      else
        this.set2faUrl(client, newUser);
    }
    this.server.emit('maj-user-2fa', newUser);
  }

  /* ********************************************************* */
	/*                     TwoFa.tsx                             */
	/* ********************************************************* */
  @SubscribeMessage('check-secret-code')
  checkSecretCode(client: Socket, twofa: TwoFAValidation) {
    const isValid = this.twoFAService.isTwoFACodeValid(twofa.code, twofa.user);
    if (isValid) this.usersService.setTwoFAValidation(twofa.user.id, true);
    this.server.emit('secret-code-checked', twofa.user);
    console.log(JSON.stringify(twofa.user));
  }
}
