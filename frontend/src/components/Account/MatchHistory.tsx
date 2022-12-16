import { useEffect, useState } from "react";
import "../../styles/matchHistory.scss";
import axios from "../../axios.config";
import { useAuth } from "../../contexts/AuthContext";
import { IGame } from "../../interfaces/game.interface";

const MatchHistory = ({ user }) => {
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
        <ul>
          {games &&
            games.map((game: IGame, id: number) => (
              <div key={id} className={"gamePlayed gamePlayed" + game.map}>
                <li>
                  <p>
                    {game.loginLP} {game.scoreLP} - {" "} {game.loginRP}
                    {game.scoreRP}
                  </p>
                  <br />
                  <p>
                    {game.abort ? "game aborted by " + game.abort : null}
                  </p>
                </li>
              </div>
            ))}
        </ul>
      </div>
    </div>
  );
};

export default MatchHistory;
