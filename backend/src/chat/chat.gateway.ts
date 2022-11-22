import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer, OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect, WsResponse } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatRoomEntity, IChatRoom } from 'src/TypeOrm/Entities/chat.entity';
import { MemberEntity, IMember } from 'src/TypeOrm/Entities/member.entity';
import { ChatRoomDto } from 'src/TypeOrm/DTOs/chat.dto';
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
		this.server.to(theRoom.id).emit('chatToClient', newMessage);
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
		client.emit('leftRoom', infos.room);
  }

    /* ************************************************************************* */
	/*							POUR GERER LA DATABASE  						 */
	/* ************************************************************************* */

	@SubscribeMessage('createChatRoom')
	async HandleCreationRoom(client: Socket, room: ChatRoomDto): Promise<void> {

		const	theOwner = await this.usersService.getByName(room.owner);

		const newChatRoom: IChatRoom = {
			chatRoomName: room.chatRoomName,
			owner: theOwner,
			type: room.type,
			password: room.password,
		}
		let		channelCreated = await this.chatService.createChatRoom(newChatRoom);

		const	memberCreated = await this.memberService.createMember({name: theOwner.name, isAdmin: true});

		channelCreated.members = [memberCreated];
		await this.chatService.saveChatRoom(channelCreated);

		theOwner.ownedChannels = [channelCreated];
		await this.usersService.updateUser(theOwner.id);

		const sockets = await this.server.fetchSockets();
		sockets.forEach((socket: any) => socket.join(channelCreated.id));
		this.server.emit('sendNewChannel', channelCreated);
	}

	@SubscribeMessage('deleteChatRoom')
	async HandleDeletionRoom(client: Socket, room: string): Promise<void> {

		const	channelToBeDeleted = await this.chatService.findOneChatRoomByName(room);

		const sockets = await this.server.fetchSockets();
		sockets.forEach((socket: any) => socket.leave(channelToBeDeleted.id));

		this.chatService.deleteChatRoomById(channelToBeDeleted.id);
		this.server.emit('sendDeleteMessage', room);
	}

	@SubscribeMessage('updateChatRoom')
	async HandleChangingName(client: Socket, update: ChatRoomDto)
	{
		let	channel = await this.chatService.findOneChatRoomByName(update.chatRoomName);

		let updatedChatRoom: IChatRoom;

		updatedChatRoom.chatRoomName = update.chatRoomName ? update.chatRoomName : channel.chatRoomName;

		updatedChatRoom.password = update.password ? update.password : channel.password;
		
		updatedChatRoom.type = update.type ? update.type : channel.type;

		updatedChatRoom.createdAt = channel.createdAt;
		updatedChatRoom.members = channel.members;
		updatedChatRoom.messages = channel.messages;


		// await this.chatService.saveChatRoom(channelToChange);
	}


	@SubscribeMessage('getAllChannels')
	async HandleGettingChannels(client: Socket) : Promise<void> {
		const Channels = await this.chatService.findAllChatRooms();
		Channels.forEach((channel : ChatRoomEntity) => client.join(channel.id));
		// const Admins = await this.memberService.findAllAdminsFromOneRoom(Channels[0].id);
		// console.log(Admins);
		// const Members = await this.memberService.findAllMembersFromOneRoom(Channels[0].id);
		// console.log(Members);
		// console.log(Channels[0].owner.name);
		// console.log(Channels[0].messages);
		client.emit('sendAllChannels', Channels);
	}

}