import React, { useState, useEffect } from "react";
import io from "socket.io-client";

export const socket = io('http://localhost:3001');//back

// const Socket= () => {//TODO: retirer

// 	useEffect(() => {
// 		socket.on("user", data => {
// 			console.log("client id = " + data);
// 		});
// 		socket.emit('notification', 'Server online via socket');
// 	}, []);
// }

// export default Socket
