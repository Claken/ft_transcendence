import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);

	const getCookie = async () => {
		await axios
			.get("/me", {
				withCredentials: true,
			})
			.then((res) => {
				setUser(res.data);
				console.log("successful axios.get!");
			})
			.catch((error) => {
				console.log("error");
				console.log(error);
			});
	};
	useEffect(() => {
		getCookie();
	}, []);

	// useEffect(() => {
	// }, [user])

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
		<AuthContext.Provider value={{ user, login, loginAsGuest, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
