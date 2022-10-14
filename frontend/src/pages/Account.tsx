import React, { useContext } from "react";
import LogContext from "../contexts/LogContext";
import Navigation from "../components/Navigation";
import "../styles/account.css";
import Profile from "../assets/img/profile.jpeg";

function Account() {
  const { isLog, setIsLog } = useContext(LogContext);

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
