import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

// const 	socket = io('http://localhost/3001');

const AppTestSockets = () => {

	const	title = 'WEBSOCKETS TESTER';
	const 	[messages, addMessages] = useState<string[]>([]);
	const	[text, changeText] = useState<string>("");
	const	[socket, setSocket] = useState<Socket>();
	const	[username, changeUsername] = useState<string>("");
	let 	ignore = false;

	const handleChange = (event: any) => {
		changeText(event.target.value);
	}

	const sendMessage = (event: any) => {
		event.preventDefault();
		console.log('send: ' + text);
		socket?.emit('msgToServer', text);
		changeText("");
	}

	const receiveMessage = (msg: string) => {
		console.log('recv: ' + msg);
		const messagesCopy = [...messages];

		messagesCopy.push(msg);
		addMessages(messagesCopy);
	}

	useEffect(() => {
		if (!ignore)
		{
			console.log('here');
			const newName = prompt('Enter your username: ');
			changeUsername(newName || '');
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

	return (
		<div>
			<h1>{title}</h1>
			<form onSubmit={sendMessage}>
				<input type="text" value={text} onChange={handleChange}/>
				<button type="submit">Send</button>
			</form>
			<div>
				{/* <strong>{username}</strong> */}
				{/* <p>{text}</p> */}
				{messages.map((msg: string, id: number) => <p key={id}>{msg}</p>)}
			</div>
		</div>
	)
}

export default AppTestSockets;