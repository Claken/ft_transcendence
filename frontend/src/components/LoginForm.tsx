import "../styles/page.css";

function LoginForm() {
	const api42login = "http://localhost:3001/auth/42/login";

	const handleLogin = () => {
		window.location.href = api42login;
		// abort new entry into the history stack
		// when the back button to get back to the page is pressed
	};

	return (
		<div>
			<div className="blank"></div>
			<button className="btnconfirm" onClick={handleLogin}>
				Login with 42
			</button>
		</div>
	);
}

export default LoginForm;
