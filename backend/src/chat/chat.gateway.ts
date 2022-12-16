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
import * as bcrypt from 'bcrypt';
import { DeepPartial } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DmDto } from 'src/TypeOrm/DTOs/dm.dto';
import { UserDTO } from 'src/TypeOrm/DTOs/User.dto';

// {cors: '*'} pour que chaque client dans le frontend puisse se connecter à notre gateway
@WebSocketGateway({cors: '*'}) // decorator pour dire que la classe ChatGateway sera un gateway /
export class ChatGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {

	constructor(private chatService: ChatService,
		private usersService: UsersService,
		private memberService: MemberService,
		private messageService: MessageService,
		private eventEmitter: EventEmitter2) {}

	private logger: Logger = new Logger('ChatGateway');
	private	users = {};

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

	@SubscribeMessage('addSocket') // decorator pour indiquer quelle méthode envoyer pour l'évènement dont le nom correspond à 'messages'
	AddSocket(client: Socket, name: string): void {
		this.users[name] = client;
	}

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
		const sender = await this.usersService.getByNameWithRelations(message.sender);

		const messageCreated = await this.messageService.createMessage({sender: message.sender, senderId: sender.id, content: message.msg})
		theRoom.messages.push(messageCreated);
		
		await this.chatService.saveChatRoom(theRoom);
		
		const newMessage = {
			sender: message.sender,
			senderId: sender.id,
			room: message.room,
			content: message.msg,
			date: messageCreated.createdAt,
		}
		this.server.to(theRoom.id).emit('chatToClient', newMessage);
	}

  	/* ************************************************************************* */
	/*							Pour rejoindre une room   						 */
	/* ************************************************************************* */

	@OnEvent('joinPrivateRoom')
	async joinPrivateRoom(infos: {user: string, channel: string})
	{
		const client: Socket = this.users[infos.user];
		await this.HandleJoinRoom(client, {room: infos.channel, user: infos.user, password: ""});
		await this.HandleLists(infos.channel);
	}

	@SubscribeMessage('checkPswdStatus')
	async checkPswdStatus(client: Socket, infos: {room: string, user: string})
	{
		const	channelJoined = await this.chatService.findOneChatRoomByName(infos.room);
		const	pswd: boolean = channelJoined.password === null ? false : true;
		client.emit('handleProtected', {room: infos.room, user: infos.user, pswdStatus: pswd});
	}

	@SubscribeMessage('joinRoom')
	async HandleJoinRoom(client: Socket, infos: {room: string, user: string, password: string}): Promise<void> {
		// console.log('joinRoom');

		let		channelJoined = await this.chatService.findOneChatRoomByName(infos.room);
		let		theUser = await this.usersService.getByNameWithRelations(infos.user);

		if (channelJoined.type === type.protected && channelJoined.password != null)
		{
			const isMatch = await bcrypt.compare(infos.password, channelJoined.password);
			if (!isMatch)
			{
				client.emit('wrongPasswordForTheJoin');
				return;
			}
		}

		const	memberCreated = await this.memberService.createMember({name: infos.user, user: theUser});
		channelJoined.members.push(memberCreated);

		await	this.chatService.saveChatRoom(channelJoined);

		theUser.memberships.push(await this.memberService.getMemberById(memberCreated.id));
		await	this.usersService.updateUser(theUser.id);

		client.emit('joinedRoom', infos.room);
	}

  	/* ************************************************************************* */
	/*							Pour quitter une room   						 */
	/* ************************************************************************* */

	@SubscribeMessage('leaveRoom')
	async HandleLeaveRoom(client: Socket, infos: {room: string, user: string}): Promise<void> {
		// console.log('leaveRoom');
		let		channelLeft = await this.chatService.findOneChatRoomByName(infos.room);
		let		member = await this.memberService.getMemberByNameAndChannel(infos.user, channelLeft);
		let		memberName = member.user.name;
		await	this.memberService.deleteMemberById(member.id);
		if (memberName === channelLeft.owner.name)
		{
			let		oldOwner = await this.usersService.getByNameWithRelations(infos.user);
			let		ownedChannels: ChatRoomEntity[] = [...oldOwner.ownedChannels];
			for (let i = 0; i < ownedChannels.length; i++)
			{
				if (ownedChannels[i].id === channelLeft.id)
					ownedChannels.splice(i, 1);
			}
			oldOwner.ownedChannels = ownedChannels;
			await this.usersService.updateUser(oldOwner.id);
			await this.HandleOwnerChange(client, memberName, channelLeft.id);
		}
		client.emit('leftRoom', infos.room);
  }

  async HandleOwnerChange(client: Socket, oldOwnerName: string, channelId: string) : Promise<void> {
		let 		thechannel = await this.chatService.findOneChatRoomById(channelId);
		let			newOwner: UsersEntity = null;
		let			admin: MemberEntity = null;
		let			member: MemberEntity = null;
		const		admins = await this.memberService.findAllAdminsFromOneRoom(channelId);
		if (admins.length > 0)
		{
			admin = admins.find((member: MemberEntity) => member.user.name != oldOwnerName);
			newOwner = await this.usersService.getByNameWithRelations(admin.user.name);
		}
		else
		{
			const	members = await this.memberService.findAllMembersFromOneRoom(channelId);
			if (members.length > 0)
			{
				member = members.find((member: MemberEntity) => member.user.name != oldOwnerName);
				newOwner = await this.usersService.getByNameWithRelations(member.user.name);
			}
			else
				await this.HandleDeletionRoom(client, thechannel.chatRoomName);
		}
		if (newOwner != null && newOwner != undefined)
		{
			thechannel.owner = newOwner;
			await	this.chatService.saveChatRoom(thechannel);
			newOwner.ownedChannels.push(thechannel);
			await	this.usersService.updateUser(newOwner.id);
			if (member != null && member != undefined)
			{
				member.isAdmin = true;
				await 	this.memberService.updateMember(member);
			}
			this.server.to(thechannel.id).emit("newOwner",
			{newOwner: newOwner.name, channel: thechannel.chatRoomName});
		}
  }

    /* ************************************************************************* */
	/*							POUR GERER LA DATABASE  						 */
	/* ************************************************************************* */

	@SubscribeMessage('createChatRoom')
    async HandleCreationRoom(client: Socket, room: ChatRoomDto): Promise<void> {

        const    	theOwner = await this.usersService.getByNameWithRelations(room.owner);

        const    	hash = room.type === type.protected ? await bcrypt.hash(room.password, 10) : null;

        const 		newChatRoom: IChatRoom = {
			chatRoomName: room.chatRoomName,
            owner: theOwner,
            type: room.type,
            password: hash,
        }
        let        	channelCreated = await this.chatService.createChatRoom(newChatRoom);
        const    	memberCreated = await this.memberService.createMember({name: theOwner.name, user: theOwner, isAdmin: true});

        channelCreated.members = [memberCreated];
        await this.chatService.saveChatRoom(channelCreated);

        theOwner.ownedChannels.push(channelCreated);
		theOwner.memberships.push(await this.memberService.getMemberById(memberCreated.id));
        await this.usersService.updateUser(theOwner.id);

        const sockets = await this.server.fetchSockets();
        sockets.forEach((socket: any) => socket.join(channelCreated.id));
		client.emit("Channel created");
        this.server.emit('sendNewChannel', channelCreated);
    }

	@SubscribeMessage('deleteChatRoom')
	async HandleDeletionRoom(client: Socket, room: string): Promise<void> {

		const	channelToBeDeleted = await this.chatService.findOneChatRoomByName(room);

		const sockets = await this.server.fetchSockets();
		sockets.forEach((socket: any) => socket.leave(channelToBeDeleted.id));

		await this.chatService.deleteChatRoomById(channelToBeDeleted.id);
		this.server.emit('sendDeleteMessage', room);
	}

	@SubscribeMessage('getAllChannels')
	async HandleGettingChannels(client: Socket) : Promise<void> {
		const Channels = await this.chatService.findAllChatRooms();
		// console.log("CLIENTS.JOIN");
		Channels.forEach((channel : ChatRoomEntity) => client.join(channel.id));
		client.emit('sendAllChannels', Channels);
	}

	@OnEvent('getPrivatesForFriend')
	@SubscribeMessage('getPrivates')
	async letUsGetPrivateRooms(client: Socket) : Promise<void> {
		const privates = await this.chatService.findAllPrivateRooms();
		client.emit('sendPrivates', privates);
	}

	@SubscribeMessage('getListsForOneClient')
	async HandleListsForOneClient(client: Socket, chatName: string) : Promise<void> {
		const theChannel = 	await this.chatService.findOneChatRoomByName(chatName);
		const admins =		await this.memberService.findAllAdminsFromOneRoom(theChannel.id);
		const users =		await this.memberService.findAllMembersFromOneRoom(theChannel.id);
		const bans =		await this.memberService.findAllBannedMembersFromOneRoom(theChannel.id);
		const mutes =		await this.memberService.findAllMutedMembersFromOneRoom(theChannel.id);

		client.emit('AllLists', {channel: chatName, usersList: users, adminsList: admins, banList: bans, muteList: mutes});
	}

	@OnEvent('GetListsForUser')
	@SubscribeMessage('getLists')
	async HandleLists(@MessageBody() chatName: string) : Promise<void> {
		const theChannel = 	await this.chatService.findOneChatRoomByName(chatName);
		const admins =		await this.memberService.findAllAdminsFromOneRoom(theChannel.id);
		const users =		await this.memberService.findAllMembersFromOneRoom(theChannel.id);
		const bans =		await this.memberService.findAllBannedMembersFromOneRoom(theChannel.id);
		const mutes =		await this.memberService.findAllMutedMembersFromOneRoom(theChannel.id);

		this.server.emit('AllLists', {channel: chatName, usersList: users, adminsList: admins, banList: bans, muteList: mutes});
	}
	
	@SubscribeMessage('deleteChannelPassword')
	async deleteChannelPassword(client: Socket, room: string) {
		let channel = await this.chatService.findOneChatRoomByName(room);
		channel.password = null;
		if (await this.chatService.saveChatRoom(channel))
			client.emit('Password deleted');
	}

	@SubscribeMessage('updateChannelPassword')
	async updateChannelPassword(client: Socket, message: { room: string, newPassword: string}) {
		const { room, newPassword } = message;
		const channel = await this.chatService.findOneChatRoomByName(room);
		const hash = await bcrypt.hash(newPassword, 10);
		channel.password = hash;
		if (await this.chatService.saveChatRoom(channel))
			client.emit('Password updated');
	}

	@SubscribeMessage('setUserAsAdmin')
	async setUserAsAdmin(client: Socket, user: {name: string, channel: string}) : Promise<void>
	{
		const channel = await this.chatService.findOneChatRoomByName(user.channel);
		let member = await this.memberService.getMemberByNameAndChannel(user.name, channel);
		member.isAdmin = true;
		await	this.memberService.updateMember(member);
		await 	this.HandleLists(channel.chatRoomName);
	}

	@SubscribeMessage('banMember')
	async banMember(client: Socket, user: {name: string, channel: string, time: number}) {
		let channel = await this.chatService.findOneChatRoomByName(user.channel);
		let member = await this.memberService.getMemberByNameAndChannel(user.name, channel);
		member.isBan = true;
		member.timeBanInMinute = user.time;
		await 	this.memberService.updateMember(member);
		await 	this.HandleLists(channel.chatRoomName);
		this.users[user.name].emit('BanStatus', {status: true, channel: channel.chatRoomName});

		setTimeout(async () => {
			member.isBan = false;
			member.timeBanInMinute = 0;
			await 	this.memberService.updateMember(member);
			await	this.HandleLists(channel.chatRoomName);
			this.users[user.name].emit('BanStatus', {status: false, channel: channel.chatRoomName});
		}, user.time * 60000);
	}

	@SubscribeMessage('muteMember')
	async muteMember(client: Socket, user: {name: string, channel: string, time: number}) {
		let channel = await this.chatService.findOneChatRoomByName(user.channel);
		let member = await this.memberService.getMemberByNameAndChannel(user.name, channel);
		member.isMute = true;
		member.timeMuteInMinute = user.time;
		await 	this.memberService.updateMember(member);
		await 	this.HandleLists(channel.chatRoomName);
		this.users[user.name].emit('MuteStatus', {status: true, channel: channel.chatRoomName, time : user.time});

		setTimeout(async () => {
			member.isMute = false;
			member.timeBanInMinute = 0;
			await 	this.memberService.updateMember(member);
			await 	this.HandleLists(channel.chatRoomName);
			this.users[user.name].emit('MuteStatus', {status: false, channel: channel.chatRoomName});
		}, user.time * 60000);
	}

	@SubscribeMessage('getFriendsList')
	async getFriendsList(client: Socket, username: string) : Promise<void>
	{
		const user =  await this.usersService.getByNameWithRelations(username);
		client.emit('recvFriendsList', user.friends);
	}

	@SubscribeMessage('emitForAnPrInvite')
	emitForAnPrInvite(client: Socket, infos: {sender: string, receiver: string, channel: string})
	{
		const invite = {
			sender: infos.sender,
			receiver: infos.receiver,
			message: infos.channel
		}
		this.eventEmitter.emit('sendPrivateRoomInvite', invite);
	}

	@SubscribeMessage('createGameInvite')
	async CreateGameInvite(client: Socket, infos: {user: UserDTO, userList: string[], name: string}) {
		infos.user = await this.usersService.updateInviteUser(infos.user.id, true);
		this.eventEmitter.emit('createGameInvite', {inviter: infos.user, userList: infos.userList, roomName: infos.name});
	}

	@SubscribeMessage('invitationAccepted')
	async InvitationAccepted(client: Socket, infos: {user: UserDTO, inviter: string, gameId: number, name: string}) {
		this.eventEmitter.emit('acceptInvite', {user: infos.user, inviter: infos.inviter, gameId: infos.gameId, roomName: infos.name});
	}

	@OnEvent('sendGameInvite')
	async SendGameInvite(infos: {gameId: number, inviter: string, room: string}) {
		let channel = await this.chatService.findOneChatRoomByName(infos.room);
		channel.InviteGameId = infos.gameId;
		channel.InviteUserName = infos.inviter;
		channel = await this.chatService.saveChatRoom(channel);
		this.users[infos.inviter].emit('recvGameInvite');
		this.server.to(channel.id).emit("changeGameButton", {status: "join", channel: channel});
	}

	@OnEvent('gamePrepareToTheJoin')
	async GamePrepareToTheJoin(infos: {joiner: string, room: string}) {
		let channel = await this.chatService.findOneChatRoomByName(infos.room);
		let updatedUser: UserDTO = await this.usersService.getByName(infos.joiner)
		updatedUser = await this.usersService.updateUser(updatedUser.id)
		this.users[infos.joiner].emit('updateUser', updatedUser);
		channel.InviteGameId = 0;
		channel.InviteUserName = "";
		channel = await this.chatService.saveChatRoom(channel);
		this.users[infos.joiner].emit('navigateToTheGame');
		this.server.to(channel.id).emit("changeGameButton", {status: "invite", channel: channel});
	}
	
	@SubscribeMessage('inviteAcceptCancel')
	async InvitJoinCancel(client: Socket, infos: {user: string, room: string}) {
		let channel = await this.chatService.findOneChatRoomByName(infos.room);
		if (channel.InviteGameId === 0)
			client.emit("changeGameButton", {status: "invite", channel: channel});
		else if (channel.InviteUserName !== infos.user)
			client.emit("changeGameButton", {status: "accept", channel: channel});
		else
			client.emit("changeGameButton", {status: "cancel", channel: channel});
	}
	
	@OnEvent('updateGameButton')
	async UpdateGameButton(infos: {gameId: number, status: string, inviter: string, room: string}) {
		//On cherche le channel
		const channel = await this.chatService.findOneChatRoomByName(infos.room);
		//On set les param avec ceux reçu
		channel.InviteGameId = infos.gameId;
		channel.InviteUserName = infos.inviter;
		//On met à jours la game
		await this.chatService.saveChatRoom(channel);
		//il faut emit à ceux du channel pour mettre à jours le button
		this.server.to(channel.id).emit("changeGameButton", {status: infos.status, channel: channel});
	}

	@SubscribeMessage('askToCancelGameInvite')
	askToCancelGameInvite(client: Socket, user: UserDTO) {
	this.eventEmitter.emit('askToCancelInvite', user);
	}

	@SubscribeMessage('updateUserChat')
	async UpdateUserChat(client: Socket, user: UserDTO) {
		user = await this.usersService.updateInGame(user.id, false);
		client.emit("updateUser", user);
	}

}
