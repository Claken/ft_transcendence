import React, { useState, useEffect } from 'react';
import io, { Socket } from 'socket.io-client';

// const 	socket = io('http://localhost/3001');

const AppTestSockets = () => {

	const	title = 'PROTO CHATROOM';
	const 	[messages, addMessages] = useState<{sender: string; message: string}[]>([])
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
		socket?.emit('msgToServer', {sender: username, message: text});
		changeText("");
	}

	const receiveMessage = (obj: {sender: string, message: string}) => {
		console.log('recv: ' + obj.message);
		console.log('recv: ' + obj.sender);
		const messagesCopy = [...messages];

		messagesCopy.push(obj);
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
				{messages.map((msg: any, id: number) => <ul key={id}><strong>{msg.sender}:</strong> {msg.message}</ul>)}
			</div>
		</div>
	)
}

export default AppTestSockets;