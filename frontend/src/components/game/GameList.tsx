import { useState } from "react";
import { IGame } from "../../interfaces/game.interface";
import "../../styles/gameList.scss";
import axios from "../../axios.config";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const GameList = () => {
	const [games, setGames] = useState<IGame[]>([]);
	const navigate = useNavigate();

	const getGames = async () => {
		await axios
			.get("/game")
			.then((res) => {
				setGames(
					res.data.filter(
						(game: IGame, id: number) =>
							game?.isFinish === false &&
							game?.waitingForOppenent === false
					)
				);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
        getGames();
		const interval = setInterval(() => {getGames()}, 1000);
		return () => {
			clearInterval(interval);
		}
	}, []);

	const redirectToGame = (game: IGame) => {
		navigate("/pong/" + game.id);
	}

	return (
		<div className="gameList-container">
			{games &&
				games.map((game: IGame, id: number) => (
                	<button onClick={() => redirectToGame(game)} key={id} className="game">
						<div className="loginLP">{game.nameLP}</div>
						<div className="loginRP">{game.nameRP}</div>
					</button>
				))}
				{/* TODO: css multiple game navbar disappear  */}
			{/* <button className="game">
				<div className="loginLP">player1</div>
				<div className="loginRP">player2</div>
			</button>
			<button className="game">
				<div className="loginLP">player1</div>
				<div className="loginRP">player2</div>
			</button>
			<button className="game">
				<div className="loginLP">player1</div>
				<div className="loginRP">player2</div>
			</button> */}
		
		</div>
	);
};

export default GameList;
