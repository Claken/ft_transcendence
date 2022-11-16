import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import guestPic from "../assets/img/profile1.jpg"
import { IAuthContext } from "../interfaces/authcontext.interface";

const AuthContext = React.createContext<IAuthContext>(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);

	useEffect(() => {
		let subscribed = true; //TODO: subscribe only in dev_mode strictmode => double render
		const token = localStorage.getItem("MY_PONG_APP");
		// GET session/cookie42
		if (subscribed) {
			axios
				.get("/me", {
					withCredentials: true,
				})
				.then((res) => {
					if (res.data) {
						setUser(res.data);
						// console.log(res.data);
						localStorage.setItem(
							"MY_PONG_APP",
							JSON.stringify(res.data)
						);
					}
				})
				.catch((error) => {
					console.log(error);
				});
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
		<AuthContext.Provider value={{ user, setUser, loginAsGuest, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
