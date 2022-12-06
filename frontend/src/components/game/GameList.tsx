import { useState } from "react";
import { IGame } from "../../interfaces/game.interface";
import "../../styles/gameList.scss";
import axios from "../../axios.config";
import { useEffect } from "react";

const GameList = () => {
	const [games, setGames] = useState<IGame[]>([]);

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
		setInterval(() => {getGames()}, 1000);
	}, []);

	const redirectToGame = () => {}

	return (
		<div className="gameList-container">
			{games &&
				games.map((game: IGame, id: number) => (
                	<button onClick={redirectToGame} key={id} className="game">
						<div className="loginLP">{game.loginLP}</div>
						<div className="loginRP">{game.loginRP}</div>
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
