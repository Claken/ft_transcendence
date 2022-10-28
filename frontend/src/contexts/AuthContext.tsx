import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import { IGame } from "../interfaces/game.interface";
import guestPic from "../assets/img/profile1.jpg";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);
	const [users, setUsers] = useState<IUser[]>([]);
	const [games, setGames] = useState<IGame[]>([]);
	const [pendingGames, setPendingGames] = useState<IGame[]>([]);


	const getWaitedGames = async () => {
		await axios
			.get("/game/waitedGames")
			.then((res) => {
				setPendingGames(res.data);
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// GET all users
	const getGames = async () => {
		await axios
			.get("/game")
			.then((res) => {
				setGames(res.data);
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// GET all users
	const getUsers = async () => {
		await axios
			.get("/users")
			.then((res) => {
				setUsers(res.data);
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// GET session/cookie42
	const getSessionCookie = async () => {
		await axios
			.get("/me", {
				withCredentials: true,
			})
			.then((res) => {
				if (res.data) {
					setUser(res.data);
					localStorage.setItem(
						"MY_PONG_APP",
						JSON.stringify(res.data)
					);
				} else console.log("getSessionCookie: empty res.data");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const postGuestUser = async (user: IUser) => {
		await axios
			.post("/users", user)
			.then((res) => {
				setUser(res.data);
				localStorage.setItem("MY_PONG_APP", JSON.stringify(user));
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const deleteGuestUser = async () => {
		await axios
			.delete("/users/" + user.id)
			.then((res) => {
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getUserByname = async (name: string) => {
		await axios
			.get("/users/name/" + name)
			.then((res) => {
				if (res.data) {
					setUser(null);
					setUser(res.data);
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// if localStorage exists, setUser in getUserByname()
	useEffect(() => {
		const token = localStorage.getItem("MY_PONG_APP");

		if (token) {
			const { name } = JSON.parse(token);
			getUserByname(name);
		}
		getGames();
		getWaitedGames();
		getUsers();
		getSessionCookie();
	}, []);

	const login = () => {
		window.location.href = "http://localhost:3001/auth/42/login";
	};

	const loginAsGuest = async (guestName: string) => {
		const newUser: IUser = {
			name: guestName,
			pictureUrl: guestPic,
			status: "online",
			inGame: false,
			inQueue: false,
		};
		await postGuestUser(newUser);
	};

	// REMOVE localStorage on logout + if (Guest) deleteUser
	const logout = async () => {
		//only Stud42 have a login field
		if (user.login) {
			window.location.href = "http://localhost:3001/auth/42/logout";
		} else {
			console.log("logout: " + JSON.stringify(user));
			await deleteGuestUser();
		}
		if (localStorage.getItem("MY_PONG_APP")) {
			localStorage.removeItem("MY_PONG_APP");
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, users, setUser, games, setGames, pendingGames, setPendingGames, login, loginAsGuest, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
