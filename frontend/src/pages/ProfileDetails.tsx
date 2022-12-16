import { useState, useEffect } from "react";
import axios from "../axios.config";
import { IUser } from "../interfaces/user.interface";
import MatchHistory from "../components/Account/MatchHistory";

function ProfileDetails() {
	const [user, setUser] = useState<IUser>();
	const [blob, setBlob] = useState<Blob>(null);

	const userProfile = window.location.pathname.substring(
		window.location.pathname.lastIndexOf("/") + 1
	);

  // useEffect(())
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
			const blobFile = new Blob([blob], { type: "image/png" });
			getBase64(blobFile, (base64string) => {
				setUser((prev: IUser) => ({
					...prev,
					avatarUrl: base64string as string,
				}));
			});
		}
	}, [blob]);

	// On Avatar uploade OR on connexion

	useEffect(() => {
		const getAvatarBlob = (avatarId: number) => {
			axios
				.get("/avatar/" + avatarId, {
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
		};
		const getUserData = async () => {
			await axios
				.get("users/name/" + userProfile)
				.then((res) => {
					setUser(res.data);
					const { avatarId } = res.data;
					getAvatarBlob(avatarId);
				})
				.catch((error) => {
					console.log(error);
				});
		};
		getUserData();
	}, []);

	if (!user) return null;

	return (
		<div>
			<div className="account-container">
				<div className="profile-container">
					<div className="left-container">
						{
							<div className="profile-picture">
								<img src={user.avatarUrl} alt="profilePic" />
							</div>
						}
						<div className="profile-stats">
							<h1> {user?.name}</h1>
							<h2>Win: {user?.win}</h2>
							<h2>Lose: {user?.lose}</h2>
						</div>
					</div>
					<div className="right-container">
						<MatchHistory user={user} />
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProfileDetails;
