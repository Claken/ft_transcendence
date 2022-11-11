import { useState } from "react";
import { socket } from "../components/Socket";
import { useAuth } from "../contexts/AuthContext";

const TwoFa = () => {
	const [code, setCode] = useState("");
	const { user } = useAuth();

	const modifyCode = (event) => {
		const input = event.currentTarget.value;
		setCode(input);
	};

	const validateCode = (event) => {
		event.preventDefault();
		socket.emit("check-secret-code", {user: user, code: code});
		setCode("");
	};

	// socket.on('secret-code-checked', () => {});

	return (
		<div>
			<form className="items">
				<h3>2-Factor-Authentication</h3>
				<input
					className="input"
					type="code"
					placeholder="tape code validation"
					value={code}
					onChange={modifyCode}
				></input>
				<button className="btnconfirm" onClick={validateCode}>
					Submit
				</button>
			</form>
		</div>
	);
};

export default TwoFa;
