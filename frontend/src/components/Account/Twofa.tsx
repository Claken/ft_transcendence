/* eslint-disable react-hooks/exhaustive-deps */
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { IUser } from "../../interfaces/user.interface";
import { socket } from "../Socket";

const Twofa = () => {
	const { user, setUser } = useAuth();
	const [url, setUrl] = useState<string>("");

	/* ********************************************************* */
	/*                     Set TwoFA URL                         */
	/* ********************************************************* */
	useEffect(() => {
		if (user?.twoFASecret) socket.emit("set-2fa-url", user);
	}, []);
	const setTwoFaUrl = (otpauthUrl: string) => {
		setUrl(otpauthUrl);
	};
	useEffect(() => {
		socket.on("2fa-url-set", setTwoFaUrl);
		return () => {
			socket.off("2fa-url-set", setTwoFaUrl);
		};
	}, [setTwoFaUrl]);

	/* ********************************************************* */
	/*                   Generate TwoFA URL                      */
	/* ********************************************************* */
	const generateTwoFa = () => {
		socket.emit("generate-2fa", user);
	};

	/* ********************************************************* */
	/*                 TwoFA Enabled/Disabled                    */
	/* ********************************************************* */
	const toggleTwoFa = () => {
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
				2fa
			</button>
			{user?.isTwoFAEnabled && (
				<>
					<QRCodeCanvas
						size={104}
						level="Q"
						bgColor="#254642"
						value={url}
					/>
				</>
			)}
			<button
				className="btn btn-primary"
				type="button"
				onClick={generateTwoFa}
			>
				Generate 2fa
			</button>
		</div>
	);
};

export default Twofa;
