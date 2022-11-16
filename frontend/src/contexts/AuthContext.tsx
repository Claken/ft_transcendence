import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import guestPic from "../assets/img/profile1.jpg";

const AuthContext = React.createContext(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);

	useEffect(() => {
		let subscribed = true; //TODO: subscribe only in dev_mode strictmode => double render
		const token = localStorage.getItem("MY_PONG_APP");
		// GET session/cookie42
		axios
			.get("/me", {
				withCredentials: true,
			})
			.then((res) => {
				if (subscribed) {
					if (res.data) {
						setUser(res.data);
						localStorage.setItem(
							"MY_PONG_APP",
							JSON.stringify(res.data)
							);
					}
				}
			})
			.catch((error) => {
				console.log(error);
			});
		// Set User on refresh paged if localStorage unchanged
		if (token) {
			const { name, login } = JSON.parse(token);
			if (name && !login) {
				axios
					.get("/users/name/" + name)
					.then((res) => {
						if (subscribed) {
							setUser(null);
							setUser(res.data);
						}
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
		return () => {
			subscribed = false;
		};
	}, []);


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

	const deleteGuestUser = () => {
		axios
			.delete("/users/" + user.id)
			.then((res) => {
				console.log(res.data);
			})
			.catch((error) => {
				console.log(error);
			});
	};

	const login = () => {
		window.location.href = "http://localhost:3001/auth/42/login";
	};

	const loginAsGuest = async (guestName: string) => {
		const newUser: IUser = {
			name: guestName,
			firstAvatarUrl: guestPic,
			status: "online",
			inGame: false,
			inQueue: false,
		};
		await postGuestUser(newUser);
	};

	// REMOVE localStorage on logout and if Guest deleteUser
	const logout = () => {
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
			value={{ user, setUser, login, loginAsGuest, logout }}
		>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
