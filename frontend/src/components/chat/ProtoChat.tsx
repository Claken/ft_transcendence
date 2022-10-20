import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { isForOfStatement } from 'typescript';
import {IChatRoom} from '../../interfaces/chat.interface'

// const 	socket = io('http://localhost/3001');

interface IMessageToBack {
	sender: string;
	message: string;
}

interface IRoom {
	active: boolean;
	member: boolean;
	name: string;
	messages: IMessageToBack[];
}

const ProtoChat = () => {

	const	title = 'PROTO CHATROOM';
	const	[text, changeText] = useState<string>("");

	const	[socket, setSocket] = useState<Socket>();
	const	[username, changeUsername] = useState<string>("");
	const	[rooms, setRooms] = useState<IRoom[]>([]);

	const	[joinButton, setJoinButton] = useState<string>("Join");
	const	[joinStatus, setJoinStatus] = useState<string>("Not joined");

	const	[activeRoom, setActiveRoom] = useState<string>("");

	let 	ignore = false;

	/* ***************************************************************************** */
	/*    							Functions utiles		    					 */
	/* ***************************************************************************** */

	const findActiveRoom = (): IRoom => {
		let activeRoom: IRoom = {
			active: false,
			member: false,
			name: '',
			messages: [],
		};
		rooms.forEach((element: IRoom) => {
			if (element.active === true)
			{
				activeRoom = element;
			}
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
		rooms.forEach((element: IRoom) => {
			if (element.name === roomName)
			{
				element.active = true;
			}
			else
			{
				element.active = false;
			}
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

	const sendChatMessage = (event: any) => {
		event.preventDefault();
		const activeRoom = findActiveRoom();
		console.log('sendChat:   ' + text);
		if (activeRoom.member)
		{
			socket?.emit('chatToServer', {sender: username, room: activeRoom.name, message: text});
		}
		else
		{
			alert('you must be a member of the room bitch !');
			changeText("");
		}
	}

	const receiveChatMessage = (obj: {sender: string, room: string, message: string}) => {
	
		const theroom: IMessageToBack = {
			sender: obj.sender,
			message: obj.message,
		};

		rooms.forEach((element: IRoom) => {
			if (element.name === obj.room)
				element.messages.push(theroom);
		})
		changeText("");
	}

	const addARoom = (event: any) => {
		event.preventDefault();
		let askARoom = "";
		while (askARoom === "")
		{
			askARoom = prompt('Enter a name for your room: ')!;
			if (askARoom === null)
				return ;
			if (askARoom === "")
				alert('This is not a right name for a room !');
		}
		
		const newRoom: IRoom = {
			active: false,
			member: false,
			name: askARoom || '',
			messages: [],
		};

		const dbRoom: IChatRoom = {
			chatRoomName: askARoom,
			ownerLogin: username,
			administratorLogin: username,
			isPublic: true,
		}
		
		socket?.emit('createChatRoom', dbRoom);

		const roomsCopy = [...rooms];
		roomsCopy.push(newRoom);

		setRooms(roomsCopy);
	}

	const leftRoom = (room: string) => {
		rooms.forEach((element: any) => {
			if (element.name === room)
				element.member = false;
		});
		setJoinButtonAndStatus();
	}

	const joinedRoom = (room: string) => {
		rooms.forEach((element: any) => {
			if (element.name === room)
				element.member = true;
		});
		setJoinButtonAndStatus();
	}

	const toggleRoomMembership = (event: any) => {
		event.preventDefault();
		const activeRoom = findActiveRoom();
		if (activeRoom.member)
			socket?.emit('leaveRoom', activeRoom.name);
		else
			socket?.emit('joinRoom', activeRoom.name);
	}

	/* ***************************************************************************** */
	/*    						Les différents UseEffets    						 */
	/* ***************************************************************************** */

	// USEEFFECT POUR AVOIR NOM ET ROOM
	useEffect(() => {
		if (!ignore)
		{
			// console.log('here');
			const newName = prompt('Enter your username: ');
			changeUsername(newName || '');
			ignore = true;
		}
	}, [])

	// USEEFFECT POUR CREER UN SOCKET
	useEffect(() => {
		console.log('connect');
		const newSocket = io('http://localhost:3001');
		setSocket(newSocket);
	}, [setSocket])

	// USEFFECT POUR RECEVOIR UN MESSAGE POUR UNE ROOM
	useEffect(() => {
		socket?.on('chatToClient', receiveChatMessage);
		return () => {
			socket?.off('chatToClient', receiveChatMessage);
		}
	}, [receiveChatMessage])

	// USEFFECT POUR QUITTER UNE ROOM
	useEffect(() => {
		console.log('leftRoom');
		socket?.on('leftRoom', leftRoom);
		return () => {
			socket?.off('leftRoom', leftRoom);
		}
	}, [leftRoom])

	// USEFFECT POUR REJOINDRE UNE ROOM
	useEffect(() => {
		console.log('joinedRoom');
		socket?.on('joinedRoom', joinedRoom);
		return () => {
			socket?.off('joinedRoom', joinedRoom);
		}
	}, [joinedRoom])

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
			<table>
    			<tbody>
        			<tr>
						{rooms.map((room: any, id: number) => <td key={id}><button onClick={() => setActiveForRoom(room.name)}>{room.name}</button></td>)}
        			</tr>
    			</tbody>
			</table>
				<div>
					<p>
						Active room: {activeRoom}
					</p>
					<p>
						Status: {joinStatus + ' '}<button onClick={toggleRoomMembership}>{joinButton}</button>
					</p>
				</div>
			<div>
				{findActiveRoom().messages.map((msg: any, id: number) => <ul key={id}><strong>{msg.sender}:</strong> {msg.message}</ul>)}
			</div>
		</div>
	)
}

export default ProtoChat;