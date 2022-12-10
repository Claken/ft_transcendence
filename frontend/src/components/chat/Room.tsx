import React, { useState, useEffect } from 'react';
import {IChatRoom} from '../../interfaces/chat.interface';
import io, { Socket } from 'socket.io-client';
import { IMessageToBack } from '../../interfaces/messageToBack.interface';
import { IRoom } from '../../interfaces/room.interface';

const Rooms = (props: any) => {
	const	[rooms, setRooms] = useState<IRoom[]>([]);

	return (

		<div>

		</div>
	)
}

export default Rooms;