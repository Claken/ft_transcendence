/* eslint-disable react-hooks/exhaustive-deps */
import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
import { socket } from "../components/Socket";
import { useAuth } from "../contexts/AuthContext";
import "../styles/twofaconfig.scss";
import { Dispatch, SetStateAction } from "react";

interface IToggleTwofaConfig {
	setToggleTwoFaConfig: Dispatch<SetStateAction<boolean>>;
}

const TwoFaConfig = (props: IToggleTwofaConfig) => {
	const { user } = useAuth();
	const [code, setCode] = useState<string>("");
	const [url, setUrl] = useState<string>("");
	const [testMsg, setTestMsg] = useState<string>("");
	const [isValid, setIsValid] = useState<boolean>(false);
	const { setToggleTwoFaConfig } = props;

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
		socket.emit("test-secret-code", { user: user, code: code });
	};

	const verifyCodeSumbit = (
		event: React.FormEvent<HTMLFormElement>
	) => {
		event.preventDefault();
		socket.emit("test-secret-code", { user: user, code: code });
	};

	const checkCode = (isCodeValid: boolean) => {
		if (isCodeValid) {
			setTestMsg("2fa Code verified.");
			setIsValid(true);
		} else {
			setTestMsg("Wrong 2fa Code...");
			setIsValid(false);
		}
	};
	useEffect(() => {
		socket.on("secret-code-tested", checkCode);
		return () => {
			socket.off("secret-code-tested", checkCode);
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
			<div>
				<p>Please verify the authenticator code:</p>
				<form onSubmit={verifyCodeSumbit}>
					<input
						type="text"
						value={code}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setCode(e.target.value)
						}
					/>
				</form>
				{testMsg && <p className={isValid.toString()}>{testMsg}</p>}
			</div>

			<div className="twoFaRubrik btnVerifyCodes">
				<button
					className="btnconfirm"
					type="button"
					onClick={() => setToggleTwoFaConfig(false)}
				>
					Close
				</button>
				<button
					className="btnconfirm"
					type="button"
					onClick={verifyCode}
				>
					Verify
				</button>
			</div>
		</div>
	);
};

export default TwoFaConfig;
