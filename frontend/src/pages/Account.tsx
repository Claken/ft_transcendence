/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { socket } from "../components/Socket";
import { useAuth } from "../contexts/AuthContext";
import "../styles/account.css";
import { IUser } from "../interfaces/user.interface";
import { QRCodeCanvas } from "qrcode.react";

function Account() {
	const { user, setUser } = useAuth();
	const [url, setUrl] = useState<string>("");
	
	/* ********************************************************* */
	/*                     Set TwoFA URL                         */
	/* ********************************************************* */
	useEffect(() => {
		if (user?.twoFASecret)
			socket.emit('set-2fa-url', user);
	}, [])
	const setTwoFaUrl = (otpauthUrl: string) => {
		setUrl(otpauthUrl);
	}
	useEffect(() => {
		socket.on("2fa-url-set", setTwoFaUrl);
		return () => {
			socket.off("2fa-url-set", setTwoFaUrl);
		}
	}, [setTwoFaUrl])

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
	}
	useEffect(() => {
		socket.on("maj-user-2fa", modifyUser);
		return () => {
			socket.off("maj-user-2fa", modifyUser);
		}
	}, [modifyUser])
	
	return (
		<div>
			<div className="rectangleprofile">
				<button className="btnprofile">
					<div className="crop"></div>
				</button>
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
				<div className="rectanglestats"></div>
			</div>
		</div>
	);
}

export default Account;
