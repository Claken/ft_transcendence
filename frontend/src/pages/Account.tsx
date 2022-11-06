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

	const changeTwoFaUrl = (otpauthUrl: string) => {
		setTwoFaUrl(otpauthUrl);
		console.log(otpauthUrl);
	};
	/* ********************************************************* */
	/*                Set first time TwoFA URL                   */
	/* ********************************************************* */
	useEffect(() => {
		if (auth.user.isTwoFAEnabled) socket?.emit("setFirst-2fa", auth.user);
	}, []);
	useEffect(() => {
		let subscribed = true;
		if (subscribed) socket?.on("first-2fa-set", changeTwoFaUrl);
		return () => {
			socket?.off("first-2fa-set", changeTwoFaUrl);
			subscribed = false;
		};
	}, [changeTwoFaUrl]);

	/* ********************************************************* */
	/*                     Set TwoFA URL                         */
	/* ********************************************************* */
	useEffect(() => {
		let subscribed = true;
		if (subscribed) socket?.on("twofa-generated", changeTwoFaUrl);
		return () => {
			socket?.off("twofa-generated", changeTwoFaUrl);
			subscribed = false;
		};
	}, [changeTwoFaUrl]);

	useEffect(() => {
		if (auth?.user) {
			socket?.emit("generate-2fa", auth.user);
			console.log("emit generate-2fa");
		}
	}, [auth?.user?.isTwoFAEnabled]);

	/* ********************************************************* */
	/*                 TwoFA Enabled/Disabled                    */
	/* ********************************************************* */
	const changeTwoFa = (user: IUser) => {
		auth.setUser(user);
		console.log(auth?.user?.isTwoFAEnabled);
	};
	useEffect(() => {
		let subscribed = true;
		if (subscribed) socket?.on("twofa-toggled", changeTwoFa);
		return () => {
			socket?.off("twofa-toggled", changeTwoFa);
			subscribed = false;
		};
	}, [changeTwoFa]);
	const activateTwoFa = () => {
		if (auth?.user) {
			socket?.emit("toggle-2fa", auth.user);
		}
	};

	return (
		<div>
			<div className="rectangleprofile">
				<button className="btnprofile">
					<div className="crop"></div>
				</button>
				<button
					className="btn btn-primary"
					type="button"
					onClick={activateTwoFa}
				>
					2fa
				</button>
				{twoFaUrl ? (
					<>
						<QRCodeCanvas
							imageSettings={{
								width: 50,
								height: 50,
								src: `{twoFaUrl}`,
								excavate: false,
							}}
							level="Q"
							bgColor="#254642"
							value={twoFaUrl}
						/>
					</>
				) : (
					<>twoFa = null</>
				)}
				<div className="rectanglestats"></div>
			</div>
		</div>
	);
}

export default Account;
