import { useEffect, useState } from "react";
import { Link, useResolvedPath, useMatch } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import pongLogo from "../assets/logo/white_pong.png";
import ButtonProfile from "./ButtonProfile";
import guestPic from "../assets/img/profile1.jpg";
import "../styles/navigation.scss";

function Navigation() {
	const auth = useAuth();

	const [stylePic, setStylePic] = useState<string>(guestPic);

	useEffect(() => {
		if (auth.user && auth.user.login) {
			//TODO: css change
			setStylePic(auth.user.avatarUrl);
		}
	}, [auth.user]);

	return (
		<nav className="nav">
			{(auth.user && (
				<>
					<div className="left-list">
						<ul>
							<CustomLink to="/Social">Social</CustomLink>
							<CustomLink to="/Account">Account</CustomLink>
						</ul>
					</div>
					<div className="logo">
						<Link
							to="/pong"
							style={{ padding: "0.5px", margin: "0.5px" }}
						>
							<img src={pongLogo} height="90px" alt="game logo" />
						</Link>
					</div>
					<div className="right-list">
						<ul>
							<CustomLink to="/Channel">Chat</CustomLink>
							<li className="userListElement">
								<div className="userName">
									<h3>{auth.user.name}</h3>
								</div>
								<div className="userProfilePicture">
									<img src={stylePic} alt="profilePic" />
								</div>
							</li>
						</ul>
					</div>
				</>
			)) || (
				<div className="">
					<Link
						to="/login"
						style={{ padding: "0.5px", margin: "0.5px" }}
					>
						<img src={pongLogo} height="70px" alt="game logo" />
					</Link>
				</div>
			)}
		</nav>
	);
}

function CustomLink({ to, children, ...props }) {
	const resolvedPath = useResolvedPath(to);
	const isActive = useMatch({ path: resolvedPath.pathname, end: true });
	return (
		<li className={isActive ? "active" : ""}>
			<Link to={to} {...props}>
				{children}
			</Link>
		</li>
	);
}

export default Navigation;
