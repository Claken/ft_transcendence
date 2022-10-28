import React, {useEffect, useState} from 'react'
import { useAuth } from '../../contexts/AuthContext';
import axios from "../../axios.config";
import { IGame } from '../../interfaces/game.interface';
import { useNavigate } from 'react-router-dom';

const WaitingRoom = () => {
    const [myGame, setMyGame] = useState<IGame>(null);
    const auth = useAuth();
    const navigate = useNavigate();

    const getGameByLoginLP = async () => {
		await axios
			.get("/game/loginLP/" + auth.user.name)
			.then((res) => {
				if (res.data) {
                    console.log(res.data);
                    setMyGame(res.data);
				}
			})
			.catch((error) => {
				console.log(error);
			});
        }

    useEffect(() => {
        getGameByLoginLP();
    }, [])
	useEffect(() => {
        if (myGame && myGame.loginRP && myGame.loginRP.length)
            navigate('/pong/' + myGame.id);
	}, [auth.pendingGames]);

	return (
		<div>WaitingRoom...</div>
	)
}

export default WaitingRoom
