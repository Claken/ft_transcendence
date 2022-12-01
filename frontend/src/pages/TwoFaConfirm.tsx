/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../components/Socket";
import { useAuth } from "../contexts/AuthContext";
import { IUser } from "../interfaces/user.interface";

const TwoFaConfirm = () => {
	const [code, setCode] = useState<string>("");
	const { user, setUser } = useAuth();
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
		else alert("Wrong two faCode");
	};
	useEffect(() => {
		socket.on("secret-code-checked", checkCode);
		return () => {
			socket.off("secret-code-checked", checkCode);
		};
	}, [checkCode]);

	return (
		<div>
			<form className="items">
				<h3>2-Factor-Authentication</h3>
				<input
					className="input"
					type="code"
					placeholder="tape code validation"
					value={code}
					onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
						setCode(e.currentTarget.value)
					}
				></input>
				<button className="btnconfirm" onClick={validateCode}>
					Submit
				</button>
			</form>
		</div>
	);
};

export default TwoFaConfirm;
