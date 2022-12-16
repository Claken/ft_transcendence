import { useEffect, useState } from "react";
import "../../styles/matchHistory.scss";
import axios from "../../axios.config";
import { useAuth } from "../../contexts/AuthContext";
import { IGame } from "../../interfaces/game.interface";

const MatchHistory = () => {
	const { user } = useAuth();
	const [games, setGames] = useState<IGame[]>([]);

	useEffect(() => {
		const getMyGames = () => {
			axios
				.get("game/login/" + user?.login)
				.then((res) => {
					setGames(res.data);
				})
				.catch((error) => {
					console.log(error);
				});
		};
		if (user?.login) {
			getMyGames();
		}
	}, []);

	return (
		<div className="matchHistory">
			<div className="matchHistory-header">
				<h1>Match History</h1>
			</div>
			<div className="matchHistory-content">
				{games && games.map((game: IGame, id: number) => (
					<div key={id} className={"gamePlayed gamePlayed" + game.map}>
                        <table>
                            <tr>{game.loginLP} {game.scoreLP} - {game.loginRP} {game.scoreRP}</tr>
                            {game.abort && <tr>abort by: {game.abort}</tr>}
                        </table>
                    </div>
				))}
			</div>
		</div>
	);
};

export default MatchHistory;
