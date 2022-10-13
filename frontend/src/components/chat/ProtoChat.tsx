import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';
import { isForOfStatement } from 'typescript';

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
	const 	[messages, addMessages] = useState<IMessageToBack[]>([]);
	const	[text, changeText] = useState<string>("");
	const	[socket, setSocket] = useState<Socket>();
	const	[username, changeUsername] = useState<string>("");
	const	[rooms, setRooms] = useState<IRoom[]>([]);
	let 	ignore = false;

	/* ***************************************************************************** */
	/*    							Functions utiles		    					 */
	/* ***************************************************************************** */

	function findActiveRoom(): IRoom {
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

	function setActiveForRoom(roomName: string) {
	
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
	}

	// const isMemberOfActiveRoom = (): boolean => {
	// 	const activeRoom = findActiveRoom();
	// 	return activeRoom.member;
	// }

	/* ***************************************************************************** */
	/*    					Functions pour la gestion des chats 					 */
	/* ***************************************************************************** */

	const handleChange = (event: any) => {
		changeText(event.target.value);
	}

	const sendMessage = (event: any) => {
		event.preventDefault();
		console.log('send: ' + text);
		socket?.emit('msgToServer', {sender: username, message: text});
		changeText("");
	}

	const sendChatMessage = (event: any) => {
		event.preventDefault();
		const activeRoom = findActiveRoom();
		socket?.emit('chatToServer', {sender: username, room: activeRoom.name, message: text});
		changeText("");
	}

	const receiveChatMessage = (obj: {sender: string, room: string, message: string}) => {
		
		console.log('recvChat: ' + obj.message);
		console.log('recvChat: ' + obj.sender);
		console.log('recvChat: ' + obj.room);

		let theroom: IMessageToBack = {
			sender: obj.sender,
			message: obj.message,
		};

		rooms.forEach((element: IRoom) => {
			if (element.name === obj.room)
			{
				element.messages.push(theroom);
			}
		})
	}

	const receiveMessage = (obj: {sender: string, message: string}) => {
		console.log('recv: ' + obj.message);
		console.log('recv: ' + obj.sender);
		const messagesCopy = [...messages];

		messagesCopy.push(obj);
		addMessages(messagesCopy);
		console.log(rooms);
	}

	const addARoom = (roomName: string) => {
		const newRoom: IRoom = {
			active: false,
			member: false,
			name: roomName,
			messages: [],
		};
		
		const roomsCopy = [...rooms];
		roomsCopy.push(newRoom);

		setRooms(roomsCopy);
	}

	const leftRoom = (room: string) => {
		rooms.forEach((element: any) => {
			if (element.name === room)
			{
				element.member = false;
			}
		});
	}

	const joinedRoom = (room: string) => {
		rooms.forEach((element: any) => {
			if (element.name === room)
			{
				element.member = true;
			}
		});
	}

	const toggleRoomMembership = () => {
		const activeRoom = findActiveRoom();
		if (activeRoom.member)
		{
			socket?.emit('leaveRoom', activeRoom.name);
		}
		else
		{
			socket?.emit('joinRoom', activeRoom.name);
		}
	}

	/* ***************************************************************************** */
	/*    						Les différents UseEffets    						 */
	/* ***************************************************************************** */

	useEffect(() => {
		if (!ignore)
		{
			console.log('here');
			const newName = prompt('Enter your username: ');
			const askARoom = prompt('Enter a name for your room: ');
			changeUsername(newName || '');
			addARoom(askARoom || '');
			ignore = true;
		}
	}, [])

	useEffect(() => {
		const newSocket = io('http://localhost:3001');
		setSocket(newSocket);
	}, [setSocket])

	useEffect(() => {
		socket?.on('msgToClient', receiveMessage);
		return () => {
			socket?.off('msgToClient', receiveMessage);
		}
	}, [receiveMessage])

	useEffect(() => {
		socket?.on('chatToClient', receiveChatMessage);
		return () => {
			socket?.off('chatToClient', receiveChatMessage);
		}
	}, [receiveChatMessage])

	useEffect(() => {
		socket?.on('leftRoom', leftRoom);
		return () => {
			socket?.off('leftRoom', leftRoom);
		}
	}, [leftRoom])

	useEffect(() => {
		socket?.on('joinedRoom', joinedRoom);
		return () => {
			socket?.off('joinedRoom', joinedRoom);
		}
	}, [joinedRoom])


	return (
		<div>
			<h1>{title}</h1>
			<form onSubmit={sendMessage}>
				<input type="text" value={text} onChange={handleChange}/>
				<button type="submit">Send</button>
			</form>
			<div>
				{messages.map((msg: any, id: number) => <ul key={id}><strong>{msg.sender}:</strong> {msg.message}</ul>)}
			</div>
		</div>
	)
}

export default ProtoChat;