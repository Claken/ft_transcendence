/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import TwoFaConfig from "../../pages/TwoFaConfig";
import AvatarUpload from "./AvatarUpload";
import ChooseName from "./ChooseName";
import { socket } from "../Socket";
import { IUser } from "../../interfaces/user.interface";

const ModalSettings = () => {
	const { user, setUser } = useAuth();
	const [toggleTwoFaConfig, setToggleTwoFaConfig] = useState<boolean>(false);

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

	return (
		<div className="modal-settings">
			{toggleTwoFaConfig ? (
				<>
					<TwoFaConfig
						toggleTwoFaConfig={toggleTwoFaConfig}
						setToggleTwoFaConfig={setToggleTwoFaConfig}
					/>
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
					<div className="username-settings">
						<h2>{user?.name}</h2>
						<ChooseName />
					</div>
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
