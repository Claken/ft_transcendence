/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import TwoFaConfig from "../../pages/TwoFaConfig";
import AvatarUpload from "./AvatarUpload";
import ChooseName from "./ChooseName";
import { socket } from "../Socket";
import { IUser } from "../../interfaces/user.interface";
import axios from "../../axios.config"
import { shouldProcessLinkClick } from "react-router-dom/dist/dom";

const ModalSettings = () => {
	const { user, setUser } = useAuth();
	const [toggleTwoFaConfig, setToggleTwoFaConfig] = useState<boolean>(false);
	const show = useRef<boolean>(true);

    /* ********************************************************* */
	/*                 TwoFA Enabled/Disabled                    */
	/* ********************************************************* */
	const toggleTwoFa = () => {
		if (!user?.isTwoFAEnabled)
			setToggleTwoFaConfig(true);
		socket.emit("toggle-2fa", user);
	};

	const modifyUser = (current: IUser) => {
        current.avatarUrl = user.avatarUrl;
		setUser(current);
	};
	useEffect(() => {
		socket.on("maj-user-2fa", modifyUser);
		return () => {
			socket.off("maj-user-2fa", modifyUser);
		};
	}, [modifyUser]);

	useEffect(() => {
		const getUser = async () => {
			await axios
			.get("/users/" + user.id)
			.then((res) => {
				const { inQueue, inGame } = res.data;
				if (inQueue === true || inGame === true)
					show.current = false;
			})
			.catch((error) => {
				console.log(error);
			});
		}
		getUser();
	}, [])

	return (
		<div className="modal-settings">
			{toggleTwoFaConfig ? (
				<>
					<TwoFaConfig setToggleTwoFaConfig={setToggleTwoFaConfig} />
				</>
			) : (
				<>
					<div className="picture-settings">
						<div className="profile-picture">
							<img src={user?.avatarUrl} alt="profilePic" />
						</div>
						{user?.login && (
							<div className="uploadButton">
								<AvatarUpload />
							</div>
						)}
					</div>
					<ChooseName />
					<div className="twoFA-settings">
						<h2>
							2FA
							{user?.isTwoFAEnabled ? (
								<span style={{ color: "green" }}>On</span>
							) : (
								<span style={{ color: "red" }}>Off</span>
							)}
						</h2>
						<button
                            className="btnconfirm"
                            type="button"
                            onClick={toggleTwoFa}
                        >
                            {user.isTwoFAEnabled ? (<>Disable 2FA</>) : (<>Setup 2FA</>)}
                        </button>
					</div>
				</>
			)}
		</div>
	);
};

export default ModalSettings;
