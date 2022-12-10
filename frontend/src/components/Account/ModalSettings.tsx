/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import TwoFaConfig from "../../pages/TwoFaConfig";
import AvatarUpload from "./AvatarUpload";
import ChooseName from "./ChooseName";
import { socket } from "../Socket";
import { IUser } from "../../interfaces/user.interface";
import axios from "../../axios.config"

const ModalSettings = () => {
	const { user } = useAuth();
	const [toggleTwoFaConfig, setToggleTwoFaConfig] = useState<boolean>(false);
	const show = useRef<boolean>(true);

    /* ********************************************************* */
	/*                 TwoFA Enabled/Disabled                    */
	/* ********************************************************* */
	const toggleTwoFa = () => {
		setToggleTwoFaConfig(true);
	};

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
						<h2>2FA</h2>
						<button
                            className="btnconfirm"
                            type="button"
                            onClick={toggleTwoFa}
                        >
                            <>Setup 2FA</>
                        </button>
					</div>
				</>
			)}
		</div>
	);
};

export default ModalSettings;
