import "../styles/page.css";
import { socket } from "../components/Socket";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";



function Home() {
	const auth = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (auth.user)
			socket.emit("user", auth.user.id);
	}, [auth.user])

	socket.on("redirect", (nav) => {
		navigate("/pong/" + nav);
	});

	return (
		<div>
			<h1>Home</h1>
		</div>
	);
}

export default Home;
