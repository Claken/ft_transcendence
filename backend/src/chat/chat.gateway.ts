import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomEntity, IChatRoom } from 'src/TypeOrm/Entities/chat.entity';
import { MemberEntity, IMember } from 'src/TypeOrm/Entities/member.entity';
import { CreateRoomDto } from 'src/TypeOrm/DTOs/chat.dto';
import { IsUnion, string } from 'joi';
import { UsersService } from 'src/users/users.service';
import { UsersEntity } from 'src/TypeOrm';
import { MemberService } from './member.service';
import { combineLatest } from 'rxjs';


// {cors: '*'} pour que chaque client dans le frontend puisse se connecter à notre gateway
@WebSocketGateway({cors: '*'}) // decorator pour dire que la classe ChatGateway sera un gateway /
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(private chatService: ChatService,
		private usersService: UsersService,
		private memberService: MemberService) {}

	private logger: Logger = new Logger('ChatGateway');

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
		console.log('joinRoom');
		client.join(room);
		client.emit('joinedRoom', room);
	}

  	/* ************************************************************************* */
	/*							Pour quitter une room   						 */
	/* ************************************************************************* */

	@SubscribeMessage('leaveRoom')
	HandleLeaveRoom(client: Socket, room: string): void {
		console.log('leaveRoom');
    	client.leave(room);
    	client.emit('leftRoom', room);
  }

    /* ************************************************************************* */
	/*							POUR GERER LA DATABASE  						 */
	/* ************************************************************************* */

	@SubscribeMessage('createChatRoom')
	async HandleCreationRoom(@MessageBody() room: CreateRoomDto): Promise<void> {

		const 	theOwner = await this.usersService.getByName(room.owner);
		// const 	firstMember = new MemberEntity();

		// firstMember.name = theOwner.name;
		// this.memberService.createMember(firstMember);

		const memberCreated = await this.memberService.getMemberByName(theOwner.name);

		const newChatRoom: IChatRoom = {
			chatRoomName: room.chatRoomName,
			owner: theOwner,
			administrators: room.administrators,
			// members: [memberCreated],
			isPublic: room.isPublic,
			password: room.password,			
		}
		this.chatService.createChatRoom(newChatRoom);
		const theChannel = await this.chatService.findOneChatRoomByName(room.chatRoomName);
		theOwner.ownedChannels = [theChannel];
		this.usersService.updateUser(theOwner.id);
		this.server.emit('sendNewChannel', theChannel);
	}

	@SubscribeMessage('deleteChatRoom')
	HandleDeletionRoom(client: Socket, room: string): void {
		
		this.chatService.deleteChatRoomByName(room);
		this.server.emit('sendDeleteMessage', room);
	}

	@SubscribeMessage('modifyChatRoom')
	HandleModificationChannel(@MessageBody() room: CreateRoomDto): void {
		const modifiedRoom: IChatRoom = {
			chatRoomName: room.chatRoomName,
			administrators: room.administrators,
			isPublic: room.isPublic,
			password: room.password,
		}
	}

	@SubscribeMessage('getAllChannels')
	async HandleGettingChannels(client: Socket) : Promise<void> {
		const Channels = await this.chatService.findAllChatRooms();
		// console.log('member 0 name');
		// console.log(Channels[0].owner.name);
		// console.log(Channels[0].members[0].name);
		client.emit('sendAllChannels', Channels);
	}

}