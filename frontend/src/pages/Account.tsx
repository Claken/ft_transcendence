import React, { useContext } from "react";
import Navigation from "../components/Navigation";
import "../styles/account.css";
import Profile from "../assets/img/profile.jpeg";

function Account() {

	return (
		<div className="background">
			<Navigation />
			<div className="rectangleprofile">
				<button className="btnprofile">
					<div className="crop"></div>
				</button>
				<div className="rectanglestats"></div>
			</div>
		</div>
	);
}

export default Account;
