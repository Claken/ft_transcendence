import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import guestPic from "../assets/img/profile1.jpg";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);
	const [users, setUsers] = useState<IUser[]>(null);

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

	// getSessionCookie => check user42
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
				setUser(user);
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
			.get("/users/" + name)
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

	useEffect(() => {
		const token = localStorage.getItem("MY_PONG_APP");

		if (token) {
			const { name } = JSON.parse(token);
			getUserByname(name);
		}
		getUsers();
		getSessionCookie();
		console.log("Context UseEffect: " + JSON.stringify(user));
	}, []);

	const login = () => {
		window.location.href = "http://localhost:3001/auth/42/login";
	};
	const loginAsGuest = async (guestName: string) => {
		const newUser: IUser = {
			name: guestName,
			pictureUrl: guestPic,
			status: "online",
		};
		postGuestUser(newUser);
	};
	const logout = async () => {
		//only Stud42 have a login field
		if (user.login) {
			window.location.href = "http://localhost:3001/auth/42/logout";
		} else {
			console.log("logout: " + JSON.stringify(user));
			deleteGuestUser();
		}
		if (localStorage.getItem("MY_PONG_APP")) {
			localStorage.removeItem("MY_PONG_APP");
			setUser(null);
		}
	};

	return (
		<AuthContext.Provider
			value={{ user, users, setUser, login, loginAsGuest, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
