import React, { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../contexts/AuthContext";
import "../styles/account.css";
import { IUser } from "../interfaces/user.interface";
import { QRCodeCanvas } from "qrcode.react";

function Account() {
	const auth = useAuth();
	const [socket, setSocket] = useState<Socket>();
	const [twoFaUrl, setTwoFaUrl] = useState<string>(null);

	/* ********************************************************* */
	/*                			Create SOCKET	                 */
	/* ********************************************************* */
	useEffect(() => {
		console.log("connect");
		const newSocket = io("http://localhost:3001");
		setSocket(newSocket);
	}, [setSocket]);

	/* ********************************************************* */
	/*                Set first time TwoFA URL                   */
	/* ********************************************************* */
	useEffect(() => {
		socket?.emit("set-2fa-url", auth.user);
	}, [auth?.user?.isTwoFAEnabled]);

	socket?.on("2fa-url-set", (otpauthUrl: string) => {
		setTwoFaUrl(otpauthUrl);
	});

	/* ********************************************************* */
	/*                     Set TwoFA URL                         */
	/* ********************************************************* */
	const generateTwoFa = () => {
		socket?.emit("generate-2fa", auth.user);
	};
	socket?.on("2fa-generated", (otpauthUrl: string) => {
		setTwoFaUrl(otpauthUrl);
	});

	/* ********************************************************* */
	/*                 TwoFA Enabled/Disabled                    */
	/* ********************************************************* */
	const toggleTwoFa = () => {
		if (auth?.user) {
			socket?.emit("toggle-2fa", auth.user);
		}
	};
	socket?.on("twofa-toggled", (user: IUser) => {
		auth.setUser(user);
	});

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
				{auth?.user?.isTwoFAEnabled ? (
					<>
						<QRCodeCanvas
							// size={84}
							level="Q"
							bgColor="#254642"
							value={twoFaUrl}
						/>
					</>
				) : (
					<>twoFa = null</>
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
