/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../components/Socket";
import { useAuth } from "../contexts/AuthContext";
import { IUser } from "../interfaces/user.interface";
import "../styles/twofaconnexion.scss";

const TwoFaConnexion = () => {
	const [code, setCode] = useState<string>("");
	const { user, setUser } = useAuth();
	const [failMsg, setFailMsg] = useState<string>("");
	const navigate = useNavigate();

	const validateCode = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		socket.emit("check-secret-code", { user: user, code: code });
	};

	const checkCode = (current: IUser) => {
		setUser(current);
		if (current.isTwoFAValidated) navigate("/");
		else setFailMsg("Wrong two faCode");
	};
	useEffect(() => {
		socket.on("secret-code-checked", checkCode);
		return () => {
			socket.off("secret-code-checked", checkCode);
		};
	}, [checkCode]);

	return (
		<div className="twofa-connexion-container">
			<h1>Welcome Back</h1>
			<p>Verify the Authentication Code</p>
			<div className="twofa-connexion-box">
				<h2>Two-Factor Authentication</h2>
				<form>
					<p>
						Open the two-step verification app on your mobile device to get your verification code
					</p>
					<input
						type="code"
						placeholder="Enter the validation code"
						value={code}
						onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
							setCode(e.currentTarget.value)
						}
					></input>
					{failMsg && (<div className="failMsg">
						{failMsg}
					</div>)}
					<button className="btnconfirm" onClick={validateCode}>
						Authenticate
					</button>
				</form>
			</div>
		</div>
	);
};

export default TwoFaConnexion;
