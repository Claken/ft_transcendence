import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
/* eslint-disable react-hooks/exhaustive-deps */
import { socket } from "../components/Socket";
import { useAuth } from "../contexts/AuthContext";
import "../styles/twofaconfig.scss";
import { Dispatch, SetStateAction } from "react";
import { IUser } from "../interfaces/user.interface";

interface IToggleTwofaConfig {
	toggleTwoFaConfig: boolean;
	setToggleTwoFaConfig: Dispatch<SetStateAction<boolean>>;
}

const TwoFaConfig = (props: IToggleTwofaConfig) => {
	const { user, setUser } = useAuth();
	const [code, setCode] = useState<string>("");
	const [url, setUrl] = useState<string>("");
	const { toggleTwoFaConfig, setToggleTwoFaConfig } = props;

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
	/*                   	Submit Form	                         */
	/* ********************************************************* */

	const verifyCode = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		socket.emit("check-secret-code", { user: user, code: code });
	};

	const checkCode = (current: IUser) => {
		setUser(current);
		if (current.isTwoFAValidated) {
			setToggleTwoFaConfig(!toggleTwoFaConfig);
		} else alert("Wrong two faCode");
	};
	useEffect(() => {
		socket.on("secret-code-checked", checkCode);
		return () => {
			socket.off("secret-code-checked", checkCode);
		};
	}, [checkCode]);

	return (
		<div className="twoFaBox">
			<h3>Two-Factor Authentication (2FA)</h3>
			<h4>Configuring Google Authenticator</h4>
			<div className="twoFaRubrik">
				<ul>
					<li>
						Install Google Authenticator (IOS - Android) or Authy
						(IOS - Android).
					</li>
					<li>In the authenticator app select '+' icon.</li>
					<li>
						Select 'Scan a barcode' (or QR code) and use the phone's
						camera to scan this barcode.
					</li>
				</ul>
			</div>
			<h4>Scan QR Code</h4>
			<div className="twoFaRubrik">
				<button
					className="btnconfirm generate"
					type="button"
					onClick={generateTwoFa}
				>
					Generate 2fa
				</button>
				<div>
					<QRCodeCanvas
						size={124}
						level="Q"
						bgColor="#523B82"
						value={url}
					/>
				</div>
			</div>

			<h4>Or Enter Code Into Your App</h4>
			<div className="twoFaRubrik">
				<p>SecretKey: {user.twoFASecret} (Base32 encoded).</p>
			</div>

			<h4>Verify Code</h4>
			<div className="">
				<p>
					For changing the setting, please verify the authenticator
					code:
				</p>
				<input
					type="text"
					value={code}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setCode(e.target.value)
					}
				/>
			</div>

			<div className="twoFaRubrik btnVerifyCodes">
				<button
					className="btnconfirm"
					type="button"
					onClick={() => setToggleTwoFaConfig(false)}
				>
					Close
				</button>{" "}
				<button
					className="btnconfirm"
					type="button"
					onClick={verifyCode}
				>
					Verify & Activate
				</button>
			</div>
		</div>
	);
};

export default TwoFaConfig;
