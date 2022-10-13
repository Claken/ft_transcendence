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
}

const AppTestSockets = () => {

	const	title = 'PROTO CHATROOM';
	const 	[messages, addMessages] = useState<IMessageToBack[]>([]);
	const	[text, changeText] = useState<string>("");
	const	[socket, setSocket] = useState<Socket>();
	const	[username, changeUsername] = useState<string>("");
	const	[rooms, setRooms] = useState<IRoom[]>([]);
	let 	ignore = false;

	function findActiveRoom() {
	
		rooms.forEach((element: any) => {
			if (element.active === true)
			{
				return element;
			}
		})
	}

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
		socket?.emit('chatToServer', {sender: username, room: activeRoom, message: text});
		changeText("");
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

	/* ***************************************************************************** */
	/*    						Les différents UseEffets    						 */
	/* ***************************************************************************** */

	useEffect(() => {
		if (!ignore)
		{
			console.log('here');
			const newName = prompt('Enter your username: ');
			const askARoom = prompt('Enter a name of your room: ');
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

export default AppTestSockets;