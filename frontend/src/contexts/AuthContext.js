import React, { useContext, useState } from "react";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState(null); // replace by user interface

	const login = (user) => {
		window.location.href="http://localhost:3001/auth/42/login";
		setUser(user);
	};
	const loginAsGuest = (user) => {
		setUser(user);
	};
	const logout = () => {
		// if (get.cookie() != null)
		window.location.href="http://localhost:3001/auth/42/logout";
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
