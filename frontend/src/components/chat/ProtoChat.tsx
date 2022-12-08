import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { isForOfStatement } from 'typescript';
import {IChatRoom} from '../../interfaces/chat.interface'
import { useAuth } from '../../contexts/AuthContext'
import { IMessageToBack } from '../../interfaces/messageToBack.interface';
import { IRoom } from '../../interfaces/room.interface';
import { type } from '../../interfaces/enum';
import Account from '../../pages/Account';


// const 	socket = io('http://localhost/3001');

const ProtoChat = () => {

	const	title = 'PROTO CHATROOM';
	const	[text, changeText] = useState<string>("");

	const	[socket, setSocket] = useState<Socket>();
	const	[username, changeUsername] = useState<string>("");
	const	[rooms, setRooms] = useState<IRoom[]>([]);

	const	[joinButton, setJoinButton] = useState<string>("Join");
	const	[joinStatus, setJoinStatus] = useState<string>("Not joined");

	const	[activeRoom, setActiveRoom] = useState<string>("");

	const [password, setPassword] = useState<string>("");

	const 	auth = useAuth();

	/* ***************************************************************************** */
	/*    							Functions utiles		    					 */
	/* ***************************************************************************** */

	const findActiveRoom = (): IRoom => {
		let activeRoom: IRoom = {
			active: false,
			member: false,
			ban: false,
			mute: false,
			owner: '',
			name: '',
			type: type.public,
			messages: [],
		};
		rooms.forEach((element: IRoom) => {
			if (element.active === true)
				activeRoom = element;
		})
		return activeRoom;
	}

	const setJoinButtonAndStatus = () => {
		const activeRoom = findActiveRoom();
		if (activeRoom.member)
		{
			setJoinButton("Leave");
			setJoinStatus("Joined");
		}
		else
		{
			setJoinButton("Join");
			setJoinStatus("Not joined");
		}
	}

	const setActiveForRoom = (roomName: string) => {
		rooms.forEach((element: IRoom) =>
		{
			element.active = element.name === roomName ? true : false;
		})
		setActiveRoom(roomName);
		setJoinButtonAndStatus();
	}

	/* ***************************************************************************** */
	/*    					Functions pour la gestion des chats 					 */
	/* ***************************************************************************** */

	const handleChange = (event: any) => {
		console.log('handleChange');
		changeText(event.target.value);
	}

	const wrongPasswordMessage = () => {
		alert('WRONG PASSWORD ! YOU CANNOT JOIN THIS CHANNEL');
	}

	const changeChannelOwner = (update: {newOwner: string, channel: string}) => {
		let room = rooms.find((element: IRoom) => {if (element.name === update.channel) return element});
		room.owner = update.newOwner;
		console.log(room);
	}

	const isAdminInActive = (): boolean => {

		const	activeRoom = findActiveRoom();
		let		value: boolean = false;

		activeRoom.adminsList.forEach((admin: string) => 
		{
			if (admin == username)
				value = true;
		})
		return value;
	}

	const banOrMute = (name: string) => {
		const 	activeRoom = findActiveRoom();
		let		time: number = 0;
		if (window.confirm('Do you want to ban this user ?'))
		{
			time = parseInt(prompt('insert the time in minutes please :'));
			socket?.emit('banMember', {name: name, channel: activeRoom.name, time: time})
		}
		if (window.confirm('Do you want to mute this user ?'))
		{
			time = parseInt(prompt('insert the time in minutes please :'));
			socket?.emit('muteMember', {name: name, channel: activeRoom.name, time: time})
		}
	}

	const updateBanStatus = (member: {status: boolean, channel: string}) => {
		console.log('BanStatus');
		let room = rooms.find((room: IRoom) => {if (room.name === member.channel) return room});
		room.ban = member.status;
		if (room.ban)
			alert('Congratulations, you are banned from ' + member.channel);
		else
			alert('Congratulations, you are not banned from ' + member.channel + ' anymore');
	};

	const updateMuteStatus = (member: {status: boolean, channel: string}) => {
		console.log('MuteStatus');
		let room = rooms.find((room: IRoom) => {if (room.name === member.channel) return room});
		room.ban = member.status;
		if (room.ban)
			alert('Congratulations, you are banned from ' + member.channel);
		else
			alert('Congratulations, you are not banned from ' + member.channel + ' anymore');
	};

	const getListsForAChannel = (lists: {channel: string, usersList: any[], adminsList: any[], banList: any[]}) =>
	{
		let room = rooms.find((element: IRoom) => {if (element.name === lists.channel) return element});
		let newUsers: string[] = [];
		let newAdmins: string[] = [];
		let newBans: string[] = [];
		if (lists.usersList.length > 0)
		{
			lists.usersList.forEach((element: any) => {
				newUsers.push(element.user.name);
			});
			room.usersList = newUsers;
		}
		if (lists.adminsList.length > 0)
		{
			lists.adminsList.forEach((element: any) => {
				newAdmins.push(element.user.name);
			});
			room.adminsList = newAdmins;
		}
		if (lists.banList.length > 0)
		{
			lists.banList.forEach((element: any) => {
				newBans.push(element.user.name);
			});
			room.banList = newBans;
		}
		// POUR RERENDER LA PAGE CAR ROOMS EST UN USESTATE, ET QUAND LE USESTATE EST MODIFIE CA RERENDER
		const roomsCopy = [...rooms];
		setRooms(roomsCopy);
	}

	const sendChatMessage = (event: any) => {
		event.preventDefault();
		const activeRoom = findActiveRoom();
		console.log('sendChat:   ' + text);
		if (activeRoom.member)
		{
			socket?.emit('chatToServer', {sender: username, room: activeRoom.name, msg: text});
		}
		else
		{
			alert('you must be a member of the room bitch !');
			changeText("");
		}
	}

	const receiveChatMessage = (obj: {sender: string, room: string, content: string, date: Date}) => {
	
		console.log('receiveChatMessage + ' + username);
		const theroom: IMessageToBack = {
			sender: obj.sender,
			message: obj.content,
			date: obj.date,
		};

		rooms.forEach((element: IRoom) => {
			if (element.name === obj.room)
				element.messages.push(theroom);
		})
		const roomsCopy = [...rooms];
		setRooms(roomsCopy);
		changeText("");
	}

	const addARoom = (event: any) => {
		event.preventDefault();
		let		askARoom: string = "";
		while (askARoom === "")
		{
			askARoom = prompt('Enter a name for your room: ')!;
			if (askARoom === null)
				return ;
			if (askARoom === "")
				alert('This is not a right name for a room !');
		}
		const pswd = prompt('Enter a password for your room if you want one: ');
		const typeOfRoom = pswd === null ? type.public : type.protected;
		const dbRoom: IChatRoom = {
			chatRoomName: askARoom,
			owner: username,
			type: typeOfRoom,
			password: pswd,
		}
		socket?.emit('createChatRoom', dbRoom);
	}

	const deleteARoom = (event: any) =>
	{
		event.preventDefault();
		let askARoom = "";
		let findRoom: IRoom = undefined;
		while (askARoom === "")
		{
			askARoom = prompt('Enter the name of the room you want to delete: ')!;
			if (askARoom === null)
				return ;
			if (askARoom === "")
				alert('This is not a right name for a room !');
			else if ((findRoom = rooms.find(element => {if (element.name === askARoom) return element})) === undefined)
			{
				alert('This room does not exist');
				askARoom = "";
			}
			else if (findRoom.owner !== username)
			{
				alert('You are not the owner of this channel !');
				return ;
			}
		}
		socket?.emit('deleteChatRoom', askARoom);
	}

	const leftRoom = (room: string) => {
		rooms.forEach((element: any) => {
			if (element.name === room)
				element.member = false;
		});
		setJoinButtonAndStatus();
		socket?.emit('getLists', room);
	}

	const joinedRoom = (room: string) => {
		rooms.forEach((element: any) => {
			if (element.name === room)
				element.member = true;
		});
		setJoinButtonAndStatus();
		socket?.emit('getLists', room);
	}

	const toggleRoomMembership = (event: any) => {
		event.preventDefault();
		const	activeRoom = findActiveRoom();
		let		pswd: string = null;
		if (activeRoom.member)
		{
			socket?.emit('leaveRoom', {room: activeRoom.name, user: username});
		}
		else
		{
			if (activeRoom.type === type.protected)
				pswd = prompt('you need a password to join this channel, please type it: ');
			socket?.emit('joinRoom', {room: activeRoom.name, user: username, password: pswd});
		}
	}

	const receiveAllChannels = (channels: any[]) => {
		let roomsCopy = [...rooms];

		channels.forEach(element => {
			
			let isMemberOrNot: boolean = false;
			let isBan: boolean = false;
			let isMute: boolean = false;
			let member: any = element.members.find((member: any) => member.user.name === username);
			if (member !== undefined)
			{
				isMemberOrNot = true;
				isBan = member.isBan;
				isMute = member.isMute;
			}

			const newRoom: IRoom = {
				active: false,
				member: isMemberOrNot,
				ban: isBan,
				mute: isMute,
				owner: element.owner.name,
				name: element.chatRoomName,
				type: element.type,
				messages: [],
			};
			[...element.messages].reverse().forEach((oneMessage: any) => {
				newRoom.messages.push({sender: oneMessage.sender, message: oneMessage.content, date: oneMessage.createdAt});
			});
			roomsCopy.push(newRoom);
			socket.emit('getListsForOneClient', element.chatRoomName);
		});
		setRooms(roomsCopy);
	}

	const receiveNewChannel = (channel: any) => {
		
		let isMemberOrNot: boolean = false;
		let isBan: boolean = false;
		let isMute: boolean = false;
		let member: any = channel.members.find((member: any) => member.user.name === username);
		if (member !== undefined)
		{
			isMemberOrNot = true;
			isBan = member.isBan;
			isMute = member.isMute;
		}

		const newRoom: IRoom = {
		active: false,
		member: isMemberOrNot,
		ban: isBan,
		mute: isMute,
		owner: channel.owner.name,
		name: channel.chatRoomName,
		type: channel.type,
		messages: [],
		};
		if (channel.messages !== undefined) {
			[...channel.messages].reverse().forEach((oneMessage: any) => {
				newRoom.messages.push({sender: oneMessage.sender, message: oneMessage.content, date: oneMessage.createdAt});
			});
		}
		socket?.emit('getListsForOneClient', channel.chatRoomName);

		const roomsCopy = [...rooms];
		roomsCopy.push(newRoom);
		setRooms(roomsCopy);
	}

	const deleteChannel = (channel: any) => {

		let roomsCopy = [...rooms];
		for (let i = 0; i < roomsCopy.length; i++)
		{
			if (roomsCopy[i].name === channel)
				roomsCopy.splice(i, 1);
		}
		setRooms(roomsCopy);
	}

	const deleteChannelPassword = () => {
		const	activeRoom = findActiveRoom();
		if (activeRoom && (activeRoom.owner === username) && activeRoom.type === type.protected)
			socket?.emit('deleteChannelPassword', activeRoom.name);
		else if (activeRoom.type != type.protected)
			alert('this channel is not protected');
		else if (activeRoom.owner != username)
			alert('You are not the owner of this channel !');


	}
	const updateChannelPassword = () => {
		const	activeRoom = findActiveRoom();
		if (activeRoom && (activeRoom.owner === username) && activeRoom.type === type.protected)
			socket?.emit('updateChannelPassword', {room: activeRoom.name, newPassword: password});
		else if (activeRoom.type != type.protected)
			alert('this channel is not protected');
		else if (activeRoom.owner != username)
			alert('You are not the owner of this channel !');
	}

	/* ***************************************************************************** */
	/*    						Les différents UseEffets    						 */
	/* ***************************************************************************** */

	// USEEFFECT POUR CREER UN SOCKET
	useEffect(() => {
		console.log('connect');
		const newSocket = io('http://localhost:3001');
		setSocket(newSocket);
	}, [setSocket])

	useEffect(() => {
		changeUsername(auth.user.name);
	}, [])

	useEffect(() => {
		socket?.emit('getAllChannels');
	}, [username])

	// STOCKER UN SOCKET DANS LE BACK AVEC LE NOM DU USER
	useEffect(() => {
		socket?.emit('addSocket', username);
	})

	useEffect(() => {
		socket?.on('sendAllChannels', receiveAllChannels);
		return () => {
			socket?.off('sendAllChannels', receiveAllChannels);
		}
	}, [receiveAllChannels])

	useEffect(() => {
		socket?.on('sendNewChannel', receiveNewChannel);
		return () => {
			socket?.off('sendNewChannel', receiveNewChannel);
		}
	}, [receiveNewChannel])

	useEffect(() => {
		socket?.on('sendDeleteMessage', deleteChannel);
		return () => {
			socket?.off('sendDeleteMessage', deleteChannel);
		}
	}, [receiveAllChannels])

	// USEFFECT POUR RECEVOIR UN MESSAGE POUR UNE ROOM
	useEffect(() => {
		socket?.on('chatToClient', receiveChatMessage);
		return () => {
			console.log('chatToClient name === ' + username);
			socket?.off('chatToClient', receiveChatMessage);
		}
	}, [receiveChatMessage])

	// USEFFECT POUR QUITTER UNE ROOM
	useEffect(() => {
		// console.log('leftRoom');
		socket?.on('leftRoom', leftRoom);
		return () => {
			socket?.off('leftRoom', leftRoom);
		}
	}, [leftRoom])

	// USEFFECT POUR REJOINDRE UNE ROOM
	useEffect(() => {
		// console.log('joinedRoom');
		socket?.on('joinedRoom', joinedRoom);
		return () => {
			socket?.off('joinedRoom', joinedRoom);
		}
	}, [joinedRoom])

	useEffect(() => {
		// console.log('joinedRoom');
		socket?.on('receivedUserName', joinedRoom);
		return () => {
			socket?.off('joinedRoom', joinedRoom);
		}
	}, [joinedRoom])

	// USEEFFECT POUR UN MAUVAIS MOT DE PASSE
	useEffect(() => {
		socket?.on('wrongPasswordForTheJoin', wrongPasswordMessage);
		return () => {
			socket?.off('wrongPasswordForTheJoin', wrongPasswordMessage);
		}
	}, [wrongPasswordMessage])

	// USEEFFECT POUR CHANGER LE OWNER
	useEffect(() => {
		console.log('newOwner message');
		socket?.on('newOwner', changeChannelOwner);
		return () => {
			socket?.off('newOwner', changeChannelOwner);
		}
	}, [changeChannelOwner])

	// GET LISTS
	useEffect(() => {
		socket?.on('AllLists', getListsForAChannel);
		return () => {
			socket?.off('AllLists', getListsForAChannel);
		}
	}, [getListsForAChannel])

	// UPDATE BAN STATUS
	useEffect(() => {
		socket?.on('BanStatus', updateBanStatus);
		return () => {
			socket?.off('BanStatus', updateBanStatus);
		}
	}, [updateBanStatus])

	useEffect(() => {
		socket?.on('MuteStatus', updateMuteStatus);
		return () => {
			socket?.off('MuteStatus', updateMuteStatus);
		}
	}, [updateMuteStatus])

	return (
		<div>
			<h1>{title}</h1>
			<form onSubmit={sendChatMessage}>
				<input type="text" value={text} onChange={handleChange}/>
				<button type="submit">Send</button>
			</form>
			<form onSubmit={addARoom}>
				<button type="submit"><strong>Add a room</strong></button>
			</form>
			<form onSubmit={deleteARoom}>
				<button type="submit"><strong>Delete a room</strong></button>
			</form>
			<table>
    			<tbody>
        			<tr>
						{rooms.map((room: any, id: number) => <td key={id}><button onClick={() => setActiveForRoom(room.name)}>{room.name}</button></td>)}
        			</tr>
    			</tbody>
			</table>
				<div>
					<p>
						<div>&nbsp;</div>Active room : {activeRoom}
					</p>
					<p>
						<div>&nbsp;</div>Status : {joinStatus + ' '}<button onClick={toggleRoomMembership}>{joinButton}</button>
					</p>
					<p>
						<div>&nbsp;</div>Members : {findActiveRoom().usersList ? findActiveRoom().usersList.map
						(
							(name: string) => isAdminInActive() ? <div><button onClick={() => banOrMute(name)}>{name}</button></div> : <div>{name}</div>
						) 
						: <div></div>}
					</p>
					<p>
						<div>&nbsp;</div>Admins : {findActiveRoom().adminsList ? findActiveRoom().adminsList.map((name: string) => <div>{name}</div>) : <div></div>}
					</p>
					<p>
						<div>&nbsp;</div>Banned users : {findActiveRoom().banList ? findActiveRoom().banList.map((name: string) => <div>{name}</div>) : <div></div>}
					</p>
					<p>
						<div>&nbsp;</div>
					</p>
					<p>
						<button onClick={deleteChannelPassword}>Delete password</button>
					</p>
					<form onSubmit={updateChannelPassword}>
						<input type="text" value={password} onChange={e => setPassword(e.target.value)}/>
						<button type="submit"><strong>change password</strong></button>
					</form>
				</div>
			<div>
				<div>&nbsp;</div>
				{findActiveRoom().member ? findActiveRoom().messages.map((msg: any, id: number) => <ul key={id}><strong>{msg.sender}:</strong> {msg.message} - - - <i>{msg.date}</i></ul>) : <div></div>}
			</div>
		</div>
	)
}

export default ProtoChat;