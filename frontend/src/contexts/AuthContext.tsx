import axios from "../axios.config";
import React, { useContext, useEffect, useState } from "react";
import { IUser } from "../interfaces/user.interface";
import { IAuthContext } from "../interfaces/authcontext.interface";
import { Buffer } from "buffer";

const AuthContext = React.createContext<IAuthContext>(null);

export const AuthProvider = ({ children }) => {
	const [user, setUser] = useState<IUser>(null);
	const [blob, setBlob] = useState<Blob>(null);

	/* ********************************************************* */
	/*                     User AvatarUrl Update                 */
	/* ********************************************************* */
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
	
	// set user.avatarUrl !
	useEffect(() => {
		if (blob) {
			const blobFile = new Blob([blob], { type: 'image/png' });
			getBase64(blobFile, (base64string) => {
				setUser((prev: IUser) => ({ ...prev, avatarUrl: base64string as string }));
			});
		}
	}, [blob]);

	// On Avatar uploade OR on connexion
	useEffect(() => {
		// check if userId change
		// AND if guestUser first connexion => no avatar in database
		if (user?.id) {
			axios
				.get("/avatar/" + user.avatarId, {
					responseType: "blob",
				})
				.then((res) => {
					if (res.data) {
						setBlob(res.data);
					}
				})
				.catch((error) => {
					console.log(error);
				});
		}
	}, [user?.id, user?.avatarId]);


  	/* ********************************************************* */
	/*                     On Connexion                          */
	/* ********************************************************* */
	useEffect(() => {
		const token = sessionStorage.getItem("MY_PONG_APP");
		// GET session/cookie42
		axios
			.get("/me", {
				withCredentials: true,
			})
			.then((res) => {
				if (res.data) {
					setUser(res.data);
					sessionStorage.setItem(
						"MY_PONG_APP",
						JSON.stringify(res.data)
						);
				}
			})
			.catch((error) => {
				console.log(error);
			});
		// Set GuestUser on refresh page if sessionStorage name is still in bdd
		if (token) {
			const { name, login } = JSON.parse(token);
			if (name && !login) {
				axios
					.get("/users/name/" + name)
					.then((res) => {
						// setUser(null);
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
				sessionStorage.setItem("MY_PONG_APP", JSON.stringify(user));
				// console.log(res.data);
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
			status: "online",
			inGame: false,
			inQueue: false,
		};
		await postGuestUser(newUser);
	};

	return (
		<AuthContext.Provider value={{ user, setUser, loginAsGuest, deleteGuestUser }}>
			{children}
		</AuthContext.Provider>
	);
};

export const useAuth = () => {
  return useContext(AuthContext);
};
