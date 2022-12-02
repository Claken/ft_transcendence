import { useState } from "react";
import { IGame } from "../../interfaces/game.interface";
import "../../styles/gameList.scss";

const GameList = () => {
	const [games, setGames] = useState<IGame[]>([]);

	return <div className="gameList-container">
        {/* <iframe src="" id="iframe-id" scrolling="no"></iframe> */}
        <div className="frame">frame</div>
        <div className="frame">frame</div>
        <div className="frame">frame</div>
        <div className="frame">frame</div>
        <div className="frame">frame</div>
        <div className="frame">frame</div>


    </div>;
};

export default GameList;
