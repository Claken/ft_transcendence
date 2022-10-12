import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/page.css";

function LoginForm() {
	const auth = useAuth();
	const navigate = useNavigate();
	const location = useLocation();

	const redirectPath = location.state?.path || "/";

	const handleLogin = () => {
		auth.login("John");
		navigate(redirectPath, { replace: true });
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
