import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../styles/navigation.css";

function Navigation() {
	const auth = useAuth();
	const navigate = useNavigate();

	const handleLogout = () => {
		auth.logout();
		navigate("/login");
	};

	return (
		<nav>
			<ul className="list">
				<li className="space">
					<NavLink className="link" to="/">
						<button className="btngreen">Home</button>
					</NavLink>
				</li>
				{(auth.user && (
					<>
						<li className="space">
							<h1>Welcome {auth.user}</h1>
						</li>
						<li className="space">
							<NavLink className="link" to="/pong">
								<button className="btn">Pong</button>
							</NavLink>
						</li>
						<li className="space">
							<NavLink className="link" to="/Channel">
								<button className="btn">Channel</button>
							</NavLink>
						</li>
						<li className="space">
							<NavLink className="link" to="/account">
								<button className="btn">Account</button>
							</NavLink>
						</li>
						<li>
							<button className="btngreen" onClick={handleLogout}>
								Logout
							</button>
						</li>
					</>
				)) || (
					<>
						<li>
							<NavLink className="link" to="/login">
								<button className="btngreen">Login</button>
							</NavLink>
						</li>
					</>
				)}
			</ul>
			<div className="separate"></div>
		</nav>
	);
}

export default Navigation;
