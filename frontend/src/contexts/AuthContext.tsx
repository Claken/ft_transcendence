import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import guestPic from "../assets/img/profile1.jpg";
import { useCookies } from "react-cookie";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);
	const [users, setUsers] = useState<IUser[]>(null);
	const [cookies, setCookie, removeCookie,] = useCookies(["cookie-name"]);

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

	const getCookie = async () => {
		await axios
			.get("/me", {
				withCredentials: true,
			})
			.then((res) => {
				setUser(res.data);
				console.log("successful axios.get /me!");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const setUserStatus = async (status: string) => {
		if (!user) return;
		await axios
			.put("/users/" + user.id, { status: status })
			.then((res) => {
				console.log(res.data);
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
				console.log("successful axios.get /me!");
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const deleteUser = async () => {
		await axios
			.delete("/users" + user.id)
			.then((res) => {
				setUser(null);
				console.log("successful axios.get /me!");
			})
			.catch((error) => {
				console.log(error);
			});
	};

	useEffect(() => {
		getUsers();
		getCookie();
	}, []);

	useEffect(() => {
		if (user) setUserStatus("online");
	}, [user]);

	const login = () => {
		window.location.href = "http://localhost:3001/auth/42/login";
	};
	const loginAsGuest = (guestName: string) => {
		postGuestUser({
			name: guestName,
			pictureUrl: guestPic,
			status: "online",
		});
		setCookie("cookie-name", guestName, {
			path: "/",
			maxAge: 3600,
		});
	};
	const logout = async () => {
		//only Stud42 have a login field
		if (user?.login) {
			window.location.href = "http://localhost:3001/auth/42/logout";
			setUserStatus("offline");
		} else {
			//delete guestUser
			removeCookie("cookie-name", {
				maxAge: 0
			});
			deleteUser();
		}
		setUser(null);
	};

	return (
		<AuthContext.Provider
			value={{ user, users, cookies, login, loginAsGuest, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
