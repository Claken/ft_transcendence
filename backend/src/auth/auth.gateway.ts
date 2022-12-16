import {
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MemberEntity } from 'src/TypeOrm';
import { TwoFAValidation, UserDTO } from 'src/TypeOrm/DTOs/User.dto';
import { UsersService } from 'src/users/users.service';
import { TwoFactorAuthenticationService } from './two-factor-authentication/two-factor-authentication.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@WebSocketGateway({ cors: '*' })
export class AuthGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(
    private readonly usersService: UsersService,
    private readonly twoFAService: TwoFactorAuthenticationService,
    private eventEmitter: EventEmitter2,
  ) {}

  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
  }

  async handleConnection(client: Socket) {}

  async handleDisconnect(client: Socket) {}

  /* ********************************************************* */
  /*                     Account.tsx                           */
  /* ********************************************************* */

  @SubscribeMessage('set-2fa-url')
  set2faUrl(client: Socket, user: UserDTO) {
    const otpauthUrl = this.twoFAService.setOtpauthUrl(
      user.name,
      user.twoFASecret,
    );
    this.server.emit('2fa-url-set', otpauthUrl);
  }

  @SubscribeMessage('generate-2fa')
  async generate2fa(client: Socket, user: UserDTO) {
    const { secret, otpauthUrl } = await this.twoFAService.generateTwoFASecret(
      user,
    );
    user.twoFASecret = secret;
    this.set2faUrl(client, user);
    this.server.emit('maj-user-2fa', user);
  }

  @SubscribeMessage('verify-validate-2fa')
  async verifyValidate2fa(client: Socket, twofa: TwoFAValidation) {
    const { code, user } = twofa;
    const isCodeValid = await this.twoFAService.isTwoFACodeValid(code, user);
    let newUser = await this.usersService.getById(user.id);
    if (isCodeValid) {
      newUser = await this.usersService.turnOnOffTwoFA(user.id, true);
      newUser = await this.usersService.setTwoFACertif(newUser.id, true);
    }
    this.server.emit('2fa-verified', newUser);
  }

  @SubscribeMessage('twofa-disable')
  async twofaDisable(client: Socket, user: UserDTO) {
    let newUser = await this.usersService.getById(user.id);
    if (newUser.isTwoFAEnabled) {
      newUser = await this.usersService.turnOnOffTwoFA(user.id, false);
      newUser = await this.usersService.setTwoFACertif(newUser.id, false);
    }
    this.server.emit('maj-user-2fa', newUser);
  }

  /* ********************************************************* */
  /*                     TwoFaConnexion.tsx                    */
  /* ********************************************************* */

  @SubscribeMessage('check-secret-code')
  async checkSecretCode(client: Socket, twofa: TwoFAValidation) {
    const { code, user } = twofa;
    const isCodeValid = await this.twoFAService.isTwoFACodeValid(code, user);
    if (isCodeValid) {
      this.usersService.setTwoFACertif(user.id, true);
      user.isTwoFAValidated = true;
    }
    this.server.emit('secret-code-checked', user);
  }

  /* ********************************************************* */
  /*                     Choosename.tsx                        */
  /* ********************************************************* */
  @SubscribeMessage('update-username')
  async updateUsername(
    client: Socket,
    body: { newName: string; userId: number },
  ) {
    const { newName, userId } = body;
    const oldName = await this.usersService.getName(userId);
    await this.usersService.updateName(userId, newName);
    const memberships = await this.usersService.getMembershipsFromOneUserId(
      userId,
    );
    memberships.forEach((member: MemberEntity) => {
      this.eventEmitter.emit('GetListsForUser', member.inChannel.chatRoomName);
    });
    this.eventEmitter.emit('modify_name_dm', {sender: newName, receiver: oldName});
    this.server.emit('reload_user');
  }
}
