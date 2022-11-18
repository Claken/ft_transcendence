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
import { MessageService } from './chatMessage.service';
import { type } from 'src/exports/enum';


// {cors: '*'} pour que chaque client dans le frontend puisse se connecter à notre gateway
@WebSocketGateway({cors: '*'}) // decorator pour dire que la classe ChatGateway sera un gateway /
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(private chatService: ChatService,
		private usersService: UsersService,
		private memberService: MemberService,
		private messageService: MessageService) {}

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
	async HandleMessageToRoom(@MessageBody() message: {sender: string, room: string, msg: string}): Promise<void> {

		// console.log('message.msg = ' + message.msg);
		// console.log('message.room = ' + message.room);
		let theRoom = await this.chatService.findOneChatRoomByName(message.room);

		const messageCreated = await this.messageService.createMessage({sender: message.sender, content: message.msg})
		theRoom.messages.push(messageCreated);
		
		await this.chatService.saveChatRoom(theRoom);
		
		const newMessage = {
			sender: message.sender,
			room: message.room,
			content: message.msg,
			date: messageCreated.createdAt,
		}
		this.server.to(message.room).emit('chatToClient', newMessage);
	}

  	/* ************************************************************************* */
	/*							Pour rejoindre une room   						 */
	/* ************************************************************************* */

	@SubscribeMessage('joinRoom')
	async HandleJoinRoom(client: Socket, infos: {room: string, user: string}): Promise<void> {
		console.log('joinRoom');

		let		channelJoined = await this.chatService.findOneChatRoomByName(infos.room);

		const	memberCreated = await this.memberService.createMember({name: infos.user});
		channelJoined.members.push(memberCreated);

		await	this.chatService.saveChatRoom(channelJoined);

		client.join(infos.room);		
		client.emit('joinedRoom', infos.room);
	}

  	/* ************************************************************************* */
	/*							Pour quitter une room   						 */
	/* ************************************************************************* */

	@SubscribeMessage('leaveRoom')
	async HandleLeaveRoom(client: Socket, infos: {room: string, user: string}): Promise<void> {
		console.log('leaveRoom');
		const	channelLeft = await this.chatService.findOneChatRoomByName(infos.room);
		const	member = await this.memberService.getMemberByNameAndChannel(infos.user, channelLeft);
		await	this.memberService.deleteMemberById(member.id);
    	client.leave(infos.room);
		client.emit('leftRoom', infos.room);
  }

    /* ************************************************************************* */
	/*							POUR GERER LA DATABASE  						 */
	/* ************************************************************************* */

	@SubscribeMessage('createChatRoom')
	async HandleCreationRoom(client: Socket, room: CreateRoomDto): Promise<void> {

		const	theOwner = await this.usersService.getByName(room.owner);

		const newChatRoom: IChatRoom = {
			chatRoomName: room.chatRoomName,
			owner: theOwner,
			type: room.type,
			password: room.password,
		}
		let		ChannelCreated = await this.chatService.createChatRoom(newChatRoom);

		const	memberCreated = await this.memberService.createMember({name: theOwner.name, isAdmin: true});

		ChannelCreated.members = [memberCreated];
		await this.chatService.saveChatRoom(ChannelCreated);

		theOwner.ownedChannels = [ChannelCreated];
		await this.usersService.updateUser(theOwner.id);

		client.join(room.chatRoomName);
		this.server.emit('sendNewChannel', ChannelCreated);
	}

	@SubscribeMessage('deleteChatRoom')
	HandleDeletionRoom(client: Socket, room: string): void {
		client.leave(room);
		this.chatService.deleteChatRoomByName(room);
		this.server.emit('sendDeleteMessage', room);
	}

	@SubscribeMessage('modifyChatRoom')
	HandleModificationChannel(@MessageBody() room: CreateRoomDto): void {
		const modifiedRoom: IChatRoom = {
			chatRoomName: room.chatRoomName,
			type: room.type,
			password: room.password,
		}
	}

	@SubscribeMessage('getAllChannels')
	async HandleGettingChannels(client: Socket) : Promise<void> {
		const Channels = await this.chatService.findAllChatRooms();
		// const Admins = await this.memberService.findAllAdminsFromOneRoom(Channels[0].id);
		// console.log(Admins);
		// const Members = await this.memberService.findAllMembersFromOneRoom(Channels[0].id);
		// console.log(Members);
		// console.log(Channels[0].owner.name);
		// console.log(Channels[0].messages);
		client.emit('sendAllChannels', Channels);
	}

}