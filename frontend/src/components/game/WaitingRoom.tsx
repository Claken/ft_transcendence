import React, { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import axios from "../../axios.config";
import { IGame } from "../../interfaces/game.interface";
import { useLocation, useNavigate } from "react-router-dom";

const WaitingRoom = () => {
	const navigate = useNavigate();
	const auth = useAuth();
	const { state } = useLocation();
	const { gameState } = state;
	const [game, setGame] = useState<IGame>(gameState);

	// Check every second if another user Joined the Game
	useEffect(() => {
		const interval = setInterval(() => {
			axios
				.get("/game/loginLP/" + auth.user.name)
				.then((res) => {
					if (res.data) {
						console.log(res.data)
						const { loginRP } = JSON.parse(res.data);
						if (loginRP) navigate("/pong/" + game.id);
					}
					console.log(JSON.stringify(res.data));
				})
				.catch((error) => {
					console.log(error);
				});
		}, 1000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div>
			<div>WaitingRoom...</div>
			<div>{game && JSON.stringify(game)}</div>
		</div>
	);
};

export default WaitingRoom;
