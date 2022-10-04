import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const 	socket = io('http://localhost:3001');

const AppTestSockets = () => {

	const	title = 'WEBSOCKETS TESTER';
	const 	[messages, addMessages] = useState<string[]>(['Some message', 'Another message']);
	const	[text, changeText] = useState<string>("");


	const handleChange = (event: any) => {
		changeText(event.target.value);
	}

	const sendMessage = (event: any) => {
		event.preventDefault();
		console.log('send: ' + text);
		socket.emit('msgToServer', text);
		changeText("");
	}

	const receiveMessage = (msg: string) => {
		console.log('recv: ' + msg);
		const messagesCopy = [...messages];

		messagesCopy.push(msg);
		addMessages(messagesCopy);
	}

	useEffect(() => {
		// socket = io('https://localhost:3000');
		console.log('ici');
		socket.on('msgToClient', (msg: any) => {
			receiveMessage(msg)});

		return () => {
			console.log('la');
			socket.off('msgToClient');
		}
	}, [])

	return (
		<div>
			<h1>{title}</h1>
			<form onSubmit={sendMessage}>
				<input type="text" value={text} onChange={handleChange}/>
				<button type="submit">Send</button>
			</form>
			<div>
				{messages.map((msg: string, id: number) => <p key={id}>{msg}</p>)}
			</div>
		</div>
	)
}

export default AppTestSockets;