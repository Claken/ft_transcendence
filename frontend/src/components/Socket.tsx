import React, { useState, useEffect } from "react";
import io from "socket.io-client";

export const socket = io('http://localhost:3001');

const Socket= () => {

	const [response, setResponse] = useState("");

	useEffect(() => {
		socket.on("users", data => {
			console.log("users = " + data);
		   setResponse(data);
		});
		socket.emit('notification', 'Server online via socket');
		socket.emit("toto");
	}, []);

	return (
		<p>
			It's <time dateTime={response}>{response}</time>
		</p>
	);
}

export default Socket
