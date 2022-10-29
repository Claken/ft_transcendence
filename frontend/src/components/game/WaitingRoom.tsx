import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../axios.config";
import { IGame } from "../../interfaces/game.interface";
import { useLocation, useNavigate } from "react-router-dom";

const WaitingRoom = () => {
	const navigate = useNavigate();
	const { state } = useLocation();
	const { game } = state;

	useEffect(() => {
		console.log("game: "+game)
	}, []); //TODO: on game change redirect to /pong/id

	return (
		<div>
			<div>WaitingRoom...</div>
			{/* <div>{myGame && JSON.stringify(myGame)}</div> */}
			<div>{game && JSON.stringify(game)}</div>
		</div>
	);
};

export default WaitingRoom;
