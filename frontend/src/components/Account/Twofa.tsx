/* eslint-disable react-hooks/exhaustive-deps */
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { IUser } from "../../interfaces/user.interface";
import { socket } from "../Socket";
import { Dispatch, SetStateAction } from "react";

interface IToggleTwofaConfig {
	toggleTwoFaConfig: boolean;
	setToggleTwoFaConfig: Dispatch<SetStateAction<boolean>>;
}

const Twofa = (props: IToggleTwofaConfig) => {
	const { user, setUser } = useAuth();
	const { toggleTwoFaConfig, setToggleTwoFaConfig } = props;

	

	/* ********************************************************* */
	/*                 TwoFA Enabled/Disabled                    */
	/* ********************************************************* */
	const toggleTwoFa = () => {
		setToggleTwoFaConfig(!toggleTwoFaConfig);
		socket.emit("toggle-2fa", user);
	};
	const modifyUser = (current: IUser) => {
		setUser(current);
	};
	useEffect(() => {
		socket.on("maj-user-2fa", modifyUser);
		return () => {
			socket.off("maj-user-2fa", modifyUser);
		};
	}, [modifyUser]);

	return (
		<div>
			<button
				className="btn btn-primary"
				type="button"
				onClick={toggleTwoFa}
			>
				{user.isTwoFAEnabled ? (<>Disable 2FA</>) : (<>Setup 2FA</>)}
			</button>
			
			
		</div>
	);
};

export default Twofa;
