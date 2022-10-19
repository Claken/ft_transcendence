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

	const getSessionCookie = async () => {
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
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};
	const deleteGuestUser = async () => {
		await axios
			.delete("/users" + user.id)
			.then((res) => {
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};


	useEffect(() => {
		getUsers();
		getSessionCookie();
		const data = window.localStorage.getItem('MY_PONG_APP');
		if (data !== null){ setUser(JSON.parse(data)); console.log("useEffect() user: "+user);}
	}, []);


	useEffect(() => {
		if (user !== undefined && user !== null) {
			window.localStorage.setItem('MY_PONG_APP', JSON.stringify(user))
			setUserStatus("online");
		}
	}, [user]);

	const login = () => {
		window.location.href = "http://localhost:3001/auth/42/login";
	};
	const loginAsGuest = (guestName: string) => {
		const user = {
			name: guestName,
			pictureUrl: guestPic,
			status: "online",
		};
		postGuestUser(user);
	};
	const logout = async () => {
		//only Stud42 have a login field
		const data = window.localStorage.getItem('MY_PONG_APP');
		if (user.login) {
			window.location.href = "http://localhost:3001/auth/42/logout";
			console.log('logout user.login exits');
		} else {
			//delete guestUser
			deleteGuestUser();
			console.log('deleteGuestUser');
		}
		if (data !== null) {
			// if (user !== undefined && user !== null)
			setUserStatus("offline");
			setUser(null);
			window.localStorage.removeItem('MY_PONG_APP')
		}
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
