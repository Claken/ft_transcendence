import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/page.css";

function GuestForm() {
	const { loginAsGuest } = useAuth();
	const [guestInput, setGuestInput] = useState("");
	const [errorMsg, setErrorMsg] = useState("");
	const navigate = useNavigate();

	const modifyGuestInput = (event) => {
		const input = event.currentTarget.value;
		setGuestInput(input);
	};

	const guestClient = (event) => {
		event.preventDefault();
		setErrorMsg("");
		if (guestInput === "") setErrorMsg("you need to write a name");
		else {
			loginAsGuest(guestInput);
			setGuestInput("");
			navigate('/');
		}
	};

	return (
		<div>
			<h1 className="login">Play as guest</h1>
			<form className="items" onSubmit={guestClient}>
				<input
					className="input"
					type="text"
					placeholder="write your name"
					value={guestInput}
					onChange={modifyGuestInput}
				></input>
			</form>
			<div className="blank">{errorMsg}</div>
			<button className="btnconfirm" onClick={guestClient}>
				become a guest
			</button>
		</div>
	);
}

export default GuestForm;
