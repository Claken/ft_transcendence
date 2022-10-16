import axios from "axios";
import React, { useEffect, useState } from "react";
import Navigation from "../components/Navigation";
import { IUser } from "../interfaces/user.interface";
import "../styles/page.css";

function Home() {
	const [user, setUser] = useState<IUser>(null);

	useEffect(() => {
		const getCookie = async () => {
			try {
				const response = await axios.get(
					"http://localhost:3001/auth/42/me",
					{ withCredentials: true }
				);
				setUser(response.data);
				console.log("successful axios.get!");
				console.log(user);
			} catch (error) {
				if (error) {
					console.log("error");
					console.log(error);
				}
			}
		};
		getCookie();
	}, []);

	return (
		<div className="background">
			<Navigation />
			<h1>Home</h1>
			<h2>getCookie</h2>
			<div>Login: {user ? user.login : null}</div>
		</div>
	);
}

export default Home;
