import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

import "../styles/navigation.css";

function Navigation() {
	const auth = useAuth();

	const handleLogout = () => {
		auth.logout();
	};

	const [stylePic, setStylePic] = useState<string>("guestPic");
	// TODO: change the fact that stylepic depends on size upload

	useEffect(() => {
		if (auth.user && auth.user.login) {
			//TODO: css change
			setStylePic("profilePic");
		}
	}, [auth.user]);

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
						<li className="space">
							<button className="btngreen" onClick={handleLogout}>
								Logout
							</button>
						</li>
						<li className="space">
							<h3>{auth.user.name}</h3>
						</li>
						<li className="space">
							<img
								className={stylePic}
								src={auth.user?.pictureUrl}
								alt="profilePic"
							/>
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
