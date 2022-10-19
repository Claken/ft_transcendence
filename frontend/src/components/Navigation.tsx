import { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import guestPic from "../assets/img/profile1.jpg";
import "../styles/navigation.css";

function Navigation() {
	const auth = useAuth();

	const handleLogout = () => {
		auth.logout();
	};

	const [picUrl, setPicUrl] = useState<string>(guestPic);
	const [stylePic, setStylePic] = useState<string>("guestPic");
	// TODO: pass props picUrl and stylePic to /account ?

	useEffect(() => {
		if (auth.user && auth.user.login) {
			setPicUrl(auth.user.pictureUrl);
			setStylePic("profilePic")
		}
	}, [auth?.user]);
	
	return (
		<nav>
				<ul className="list">
					<li className="space">
						<NavLink className="link" to="/">
							<button className="btngreen">Home</button>
						</NavLink>
					</li>
					{(auth?.user && (
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
									src={picUrl}
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
