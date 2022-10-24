import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/page.css";

function LoginForm() {
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const from = location.pathname || "/";

	const handleLogin = () => {
		auth.login();
		// abort new entry into the history stack
		// when the back button to get back to the page is pressed
		navigate(from, { replace: true });
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
