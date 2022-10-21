import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import guestPic from "../assets/img/profile1.jpg";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);
	const [users, setUsers] = useState<IUser[]>(null);
	const [cookie, setCookie] = useState<string>(null);

	const getUsers = async () => {
		await axios
			.get("/users")
			.then((res) => {
				setUsers(res.data);
				console.log("getUsers: "+res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const getSessionCookie = async () => {
		await axios
			.get("/me", {
				withCredentials: true,
			})
			.then((res) => {
				setUser(res.data);
				console.log("getSessionCookie: "+res.data);
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
				console.log("postGuestUser: "+res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const deleteGuestUser = async () => {
		await axios
			.delete("/users/" + user.id)
			.then((res) => {
				console.log("deleteGuestUser: "+res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		getUsers();
		getSessionCookie();
		// setTimeout(() => {
			setCookie(JSON.parse(localStorage.getItem('MY_PONG_APP')));
		// }, 50)
		if (cookie && !user)
		{
			setUser(JSON.parse(cookie));
		}
		console.log("useEffect[]: "+ user);
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
		await postGuestUser(newUser);
		localStorage.setItem("MY_PONG_APP", JSON.stringify(newUser));
	};
	const logout = async () => {
		
		//only Stud42 have a login field
		if (user.login && user.login.length > 0) {
			window.location.href = "http://localhost:3001/auth/42/logout";
		} else {
			console.log("delete guestUser: "+ user);
			await deleteGuestUser();
		}
		if (cookie) {
			// if (user !== undefined && user !== null)
			setUser(null);	
			localStorage.removeItem("MY_PONG_APP");
		}
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, users, login, loginAsGuest, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
