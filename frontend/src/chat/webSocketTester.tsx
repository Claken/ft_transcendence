import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

function AppTestSockets() {

	const	title = 'MY TITLE';
	const 	[messages, addMessages] = useState<string[]>(['Some message', 'Another message']);
	const	[text, changeText] = useState<string>("");
	let 	socket = null;

	const sendMessage = (event: any) => {
		event.preventDefault();
		changeText(event.target.value);
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
		socket = io('https://localhost:3000');
		socket.on('msgToClient', (msg: string) => {
			this.receiveMessage(msg);
		})

		return () => {
			socket.off('msgToClient');
		}
	}, [])

	return (
		<div>
			<h1>{{title}}</h1>
			<form onSubmit={sendMessage}>
				<input type='text' value={text} />
				<button type="submit">Send</button>
			</form>
			<div>{messages.map((id: number, msg: string) => {
				<p key={id}>{msg}</p>
			})}</div>
			
		</div>
	)
}

export default AppTestSockets;