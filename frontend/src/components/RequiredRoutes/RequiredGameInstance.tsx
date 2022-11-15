import { Navigate, useLocation, Outlet, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "../../axios.config";

const RequiredGameInstance = () => {
	const location = useLocation();
    const params = useParams();
    const [gameId, setGameId] = useState<number>(0); // if id=1 is first

    useEffect(() => {
        const getGameById = async (id: number) => {
            await axios
                .get("/game/" + id)
                .then((res) => {
                    setGameId(res.data);
                })
                .catch((error) => {
					//TODO: error404 ?
                    console.log(error);
                });
            };
        getGameById(Number(params));
    }, [])
    
	return gameId ? (
		<Outlet />
	) : (		
		<Navigate to="/pong" state={{ from: location }} replace />
	);
};

export default RequiredGameInstance;
