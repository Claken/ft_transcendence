import "../styles/account.scss";
import Modal from "../components/modal";
import useModal from "../hooks/useModal";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import ModalSettings from "../components/Account/ModalSettings";
import MatchHistory from "../components/Account/MatchHistory";
import { socket } from "../components/Socket";
import { IUser } from "../interfaces/user.interface";
import { useState, useEffect } from "react";

function Account() {
	const auth = useAuth();
	const navigate = useNavigate();
	const [updated, setUpdated] = useState<boolean>(false);

	useEffect(() => {
		if (auth.user)
			socket.emit("updateTheUser", auth.user);
	}, [auth.user]);

	socket.on("updateTheUser", (user: IUser) => {
		if (user.name === auth.user.name) {
			user.avatarUrl = auth.user.avatarUrl;
			auth.user = user;
			setUpdated(true);
		}
	});
	
	const handleLogout = () => {
		// only api42 have a login field
		if (auth.user?.login) {
			window.location.href = "http://localhost:3001/auth/42/logout";
		} else {
			// console.log("logout: " + JSON.stringify(auth.user));
			auth.deleteGuestUser();
			if (sessionStorage.getItem("MY_PONG_APP")) {
				sessionStorage.removeItem("MY_PONG_APP");
				auth.setUser(null);
			}
			navigate('/');
		}
	};

	const { isOpen, toggle } = useModal();

	return (
		<div>
			<div className="account-container">
				<div className="profile-container">
					<div className="left-container">
						<div className="profile-picture">
							<img src={auth.user?.avatarUrl} alt="profilePic" />
						</div>
						<div className="profile-stats">
							<h1> {auth.user?.name}</h1>
							<h2>
								{updated ? ("Win: "+auth.user?.win) : null}
							</h2>
							<h2>
								{updated ? ("Lose: "+auth.user?.lose) : null}
							</h2>
						</div>
						<div className="profile-buttons">
							<button onClick={toggle}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-settings"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									strokeWidth="2"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									></path>
									<path d="M10.325 4.317c.426 -1.756 2.924 -1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543 -.94 3.31 .826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756 .426 1.756 2.924 0 3.35a1.724 1.724 0 0 0 -1.066 2.573c.94 1.543 -.826 3.31 -2.37 2.37a1.724 1.724 0 0 0 -2.572 1.065c-.426 1.756 -2.924 1.756 -3.35 0a1.724 1.724 0 0 0 -2.573 -1.066c-1.543 .94 -3.31 -.826 -2.37 -2.37a1.724 1.724 0 0 0 -1.065 -2.572c-1.756 -.426 -1.756 -2.924 0 -3.35a1.724 1.724 0 0 0 1.066 -2.573c-.94 -1.543 .826 -3.31 2.37 -2.37c1 .608 2.296 .07 2.572 -1.065z"></path>
									<circle cx="12" cy="12" r="3"></circle>
								</svg>
							</button>
							<Modal isOpen={isOpen} toggle={toggle}>
								<ModalSettings  />
							</Modal>
							<button onClick={handleLogout}>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									className="icon icon-tabler icon-tabler-logout"
									width="24"
									height="24"
									viewBox="0 0 24 24"
									strokeWidth="2"
									stroke="currentColor"
									fill="none"
									strokeLinecap="round"
									strokeLinejoin="round"
								>
									<path
										stroke="none"
										d="M0 0h24v24H0z"
										fill="none"
									></path>
									<path d="M14 8v-2a2 2 0 0 0 -2 -2h-7a2 2 0 0 0 -2 2v12a2 2 0 0 0 2 2h7a2 2 0 0 0 2 -2v-2"></path>
									<path d="M7 12h14l-3 -3m0 6l3 -3"></path>
								</svg>
							</button>
						</div>
					</div>
					<div className="right-container">
						<MatchHistory user={auth.user}/>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Account;
