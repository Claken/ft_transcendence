import React, { useState } from "react";
import "../styles/page.css";

function RegisterForm() {
	const [registerInput, setRegisterInput] = useState("")
	const [registerPassInput, setRegisterPassInput] = useState("");
	const [registerPassConfirmInput, setRegisterPassConfirmInput] = useState("");

	const modifyRegisterInput = (event) => {
		const input = event.currentTarget.value;
    setRegisterInput(input);
	}

	const modifyRegisterPassInput = (event) => {
		const input = event.currentTarget.value;
    setRegisterPassInput(input);
	}

	const modifyRegisterPassConfirmInput = (event) => {
		const input = event.currentTarget.value;
    setRegisterPassConfirmInput(input);
	}

	const registerClient = () => {
		setRegisterInput("");
		setRegisterPassInput("");
		setRegisterPassConfirmInput("");
	}

	return (
		<div>
			<h1 className="register">Register</h1>
			<form className="items" onSubmit={registerClient}>
				<input className="input" type="text" placeholder="write your name" value={registerInput} onChange={modifyRegisterInput}></input>
			</form>
			<form className="items" onSubmit={registerClient}>
				<input className="input" type="text" placeholder="write your password" value={registerPassInput} onChange={modifyRegisterPassInput}></input>
			</form>
			<form className="items" onSubmit={registerClient}>
				<input className="input" type="text" placeholder="confirm your password" value={registerPassConfirmInput} onChange={modifyRegisterPassConfirmInput}></input>
			</form>
			<div className="blank"></div>
			<button className="btnconfirm" onClick={registerClient}>Register</button>
		</div>
	);
}

export default RegisterForm