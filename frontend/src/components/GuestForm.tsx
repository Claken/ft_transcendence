import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/page.css";

function GuestForm() {
	const { loginAsGuest } = useAuth();
	const [guestInput, setGuestInput] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = useNavigate();

	const modifyGuestInput = (event: React.ChangeEvent<HTMLInputElement>) => {
		const input = event.currentTarget.value;
		setGuestInput(input);
	};

	const isAlpha = (input: string) => {
		for (let index = 0; index < input.length; index++) {
			const element = input.charCodeAt(index);
			if ((element < 48 || element > 122) ||
			element >= 58 && element <=64)
				return false
		}
		return true
	}

	const guestClient = (
		event: React.MouseEvent<HTMLButtonElement, MouseEvent>
	) => {
		event.preventDefault();
		setErrorMsg("");
		if (guestInput === "")
			setErrorMsg("you need to write a name");
		else if (guestInput.length > 10)
			setErrorMsg("Name too long");
		else if (isAlpha(guestInput) === false)
			setErrorMsg("Name contains none alphanumeric character");
		else {
			loginAsGuest(guestInput);
			setGuestInput("");
			navigate("/");
		}
	};

	return (
		<div>
			<h1 className="login">Play as guest</h1>
			<form className="items">
				<input
					className="input"
					type="text"
					placeholder="write your name"
					value={guestInput}
					onChange={modifyGuestInput}
				></input>
				<div className="blank">{errorMsg}</div>
				<button className="btnconfirm" onClick={guestClient}>
					become a guest
				</button>
			</form>
		</div>
	);
}

export default GuestForm;
