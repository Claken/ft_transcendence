
import "../styles/account.css";
import Twofa from "../components/Account/Twofa";

function Account() {
	

	return (
		<div>
			<div className="rectangleprofile">
				<button className="btnprofile">
					<div className="crop"></div>
				</button>
				<div className="twoFA-settings">
                    <Twofa />
                  </div>
				<div className="rectanglestats"></div>
			</div>
		</div>
	);
}

export default Account;
