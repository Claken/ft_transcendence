import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);
	const [onlineUsers, setOnlineUsers] = useState<IUser[]>([]);

	useEffect(() => {
		const getCookie = async () => {
			try {
				const response = await axios.get("/me", {
					withCredentials: true,
				});
				setUser(response.data);
				console.log("successful axios.get!");
			} catch (error) {
				if (error) {
					console.log("error");
					console.log(error);
				}
			}
		};
		getCookie();
	}, []);

	useEffect(() => {
		const addOnlineUser = () => {
			const cpyOnlineUsers = [...onlineUsers];
			cpyOnlineUsers.push(user);
			setOnlineUsers(cpyOnlineUsers);
		};
		addOnlineUser();
	}, [user])

	const login = () => {
		window.location.href = "http://localhost:3001/auth/42/login";
	};
	const loginAsGuest = (guestName: string) => {
		setUser({ name: guestName });
	};
	const logout = async () => {
		if (user.login)
			window.location.href = "http://localhost:3001/auth/42/logout";
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, onlineUsers, login, loginAsGuest, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
