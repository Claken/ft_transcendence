import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import guestPic from "../assets/img/profile1.jpg";
import { IAuthContext } from "../interfaces/authcontext.interface";
import { IAvatar } from "../interfaces/avatar.interfce";
import { Buffer } from 'buffer';

const AuthContext = React.createContext<IAuthContext>(null);

// const encodeBase64 = (data: Uint8Array) => {
//     return Buffer.from(data).toString('base64');
// }
// const decodeBase64 = (data) => {
//     return Buffer.from(data, 'base64').toString('ascii');
// }

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);
	// const [avatar, setAvatar] = useState<Stream>(null);
	
	// convert Blob to Base64
	const getBase64 = async (
		blob: Blob,
		cb: (res: string | ArrayBuffer) => void
	): Promise<void> => {
		let reader = new FileReader();
		reader.onload = () => {
			cb(reader.result);
		};
		reader.readAsDataURL(blob);
		reader.onerror = (error) => {
			console.log("Error: ", error);
		};
	};

	// useEffect(() => {
	// 	if (avatar) {
			// const myAvatarUrl = Buffer.from(avatar.data.buffer).toString('base64');
			// getBase64(res.data, (base64string) => {
			// 	const contentType = res.headers["content-type"];
			// 	const firstAvatarUrl =
			// 		"data:" + contentType + ";base64," + base64string;
			// 	console.log(firstAvatarUrl);
			// });

	// 	}
	// }, [avatar]);

	const getAvatar = () => {
		axios
			.get("/avatar/" + user.avatarId)
			.then((res) => {
				if (res.data) {
					const blobFile = new Blob([res.data]);
					getBase64(blobFile, (base64string) => {
						const contentType = res.headers["content-type"];
						const firstAvatarUrl =
							"data:" + contentType + ";base64," + base64string;
						console.log(firstAvatarUrl);
					});
				}
			})
			.catch((error) => {
				console.log(error);
			});
	};

	// Only on connexion get Avatar
	useEffect(() => {
		if (user?.id)
			getAvatar();
	}, [user?.id])

	useEffect(() => {
		const token = localStorage.getItem("MY_PONG_APP");
		// GET session/cookie42
		axios
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
						setUser(null);
						setUser(res.data);
					})
					.catch((error) => {
						console.log(error);
					});
			}
		}
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

	const loginAsGuest = async (guestName: string) => {
		const newUser: IUser = {
			name: guestName,
			avatarUrl: guestPic,
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
		<AuthContext.Provider value={{ user, setUser, loginAsGuest, logout }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
	return useContext(AuthContext);
};
