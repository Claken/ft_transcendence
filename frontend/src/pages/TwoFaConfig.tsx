import { QRCodeCanvas } from "qrcode.react";
import { useEffect, useState } from "react";
/* eslint-disable react-hooks/exhaustive-deps */
import { socket } from "../components/Socket";
import { useAuth } from "../contexts/AuthContext";
import "../styles/twofaconfig.scss"
const TwoFaConfig = () => {
	const { user, setUser } = useAuth();
	const [input, setInput] = useState<string>("");
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
	console.log(user)
	return (
		<div className="twoFaBox">
			<h3>Two-Factor Authentication (2FA)</h3>
			<div className="twoFaRubrik">
				<h4>Configuring Google Authenticator</h4>
				<ul>
					<li>
						Install Google Authenticator (IOS - Android) or Authy
						(IOS - Android).
					</li>
					<li>In the authenticator app select '+' icon.</li>
					<li>
						Sekect 'Scan a barcode (or QR code) and use the phone's
						camera to scan this barcode.
					</li>
				</ul>
			</div>
			<div className="twoFaRubrik">
				<h4>Scan QR Code</h4>
				{user.isTwoFAEnabled && (
					<>
						<QRCodeCanvas
							size={104}
							level="Q"
							bgColor="#254642"
							value={url}
						/>
					</>
				)}
			</div>

			<div className="twoFaRubrik">
				<h4>Or Enter Code Into Your App</h4>
				<button
					className="btn btn-primary"
					type="button"
					onClick={generateTwoFa}
				>
					Generate 2fa
				</button>
				<p>SecretKey: {user.twoFASecret} (Base32 encoded).</p>
			</div>

			<div className="twoFaRubrik">
				<h4>Verify Code</h4>
				<p>
					For changing the setting, please verify the authenticator
					code:
					<br />
					<input
					type="text"
					value={input}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setInput(e.target.value)
					}
				/>
				</p>
				
				<button>Close</button> <button>Verify & Activate</button>
			</div>
		</div>
	);
};

export default TwoFaConfig;
