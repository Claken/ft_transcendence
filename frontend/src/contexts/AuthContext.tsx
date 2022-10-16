import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);
	const [users, setUsers] = useState<IUser[]>(null);

	useEffect(() => {
		const getCookie = async () => {
			try {
				const response = await axios.get("/auth/42/me", {
					withCredentials: true,
				});
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

	// useEffect(() => {
	// 	let addUserToList = () => {
	// 		let cpyUsers = [...users];
	// 		cpyUsers.push(user);
	// 		setUsers(cpyUsers);
	// 	};
	// 	addUserToList();
	// }, [user]);

	const login = () => {
		window.location.href = "http://localhost:3001/auth/42/login";
		// axios.post()
	};
	const loginAsGuest = (guestName: string) => {
		setUser({ name: guestName });
	};
	const logout = () => {
		if (user.login)
			window.location.href = "http://localhost:3001/auth/42/logout";
		setUser(null);
	};

	return (
		<AuthContext.Provider value={{ user, login, loginAsGuest, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
