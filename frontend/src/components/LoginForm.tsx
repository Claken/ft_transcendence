import { useAuth } from "../contexts/AuthContext";
import "../styles/page.css";

function LoginForm() {
	const auth = useAuth();

	const handleLogin = () => {
		auth.login();
		// abort new entry into the history stack
		// when the back button to get back to the page is pressed
		// navigate('/account', { replace: true });
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
