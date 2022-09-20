import React, { useState } from "react";
import "../styles/page.css";

function LoginForm() {
	const [loginInput, setLoginInput] = useState("");
	const [loginPassInput, setLoginPassInput] = useState("");

	const modifyLoginInput = (event) => {
		const input = event.currentTarget.value;
    setLoginInput(input);
	}

	const modifyLoginPassInput = (event) => {
		const input = event.currentTarget.value;
    setLoginPassInput(input);
	}

	const loginClient = () => {
		setLoginInput("");
		setLoginPassInput("");
	}

	return (
		<div>
			<h1 className="register">Login</h1>
				<form className="items" onSubmit={loginClient}>
          <input className="input" type="text" placeholder="write your name" value={loginInput} onChange={modifyLoginInput}></input>
				</form>
				<form className="items" onSubmit={loginClient}>
					<input className="input" type="password" placeholder="write your password" value={loginPassInput} onChange={modifyLoginPassInput}></input>
        </form>
				<div className="blank"></div>
        <button className="btnconfirm" onClick={loginClient}>Login</button>
		</div>
	);
}

export default LoginForm