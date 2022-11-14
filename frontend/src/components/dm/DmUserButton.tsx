import React, { useState } from "react";
import { Link } from "react-router-dom";
import Rouage from "../../assets/img/rouage.png";
import { useChat } from "../../contexts/ChatContext";
import "../../styles/dmchat.css";

function DmUserButton(props) {
  const [dropDown, setDropDown] = useState(false);
	const chat = useChat();

  const isConnect = (user): boolean => {
    if (user.status === "online") return true;
    return false;
  };

  const onMouseEnter = () => {
    setDropDown(true);
  };

  const onMouseLeave = () => {
    setDropDown(false);
  };

  return (
    <li key={props.user.id}>
      <div className="btnbody">
        <button
          className="btnuser"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          {isConnect(props.user) ? (
            <div className="cercleconnect">{props.user.name}</div>
          ) : (
            <div className="cercledisconnect">{props.user.name}</div>
          )}
          {(!dropDown && <img src={Rouage} className="tourne"></img>) || (
            <img src={Rouage} className="tourne tourneanim"></img>
          )}
        </button>
        <div
          className="overlay"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="overlayleft">
            <Link to="/channel">
              <button className="overlayleft" onClick={() => chat.changeTarget(props.user)}>Messages</button>
            </Link>
          </div>
          <div className="overlayright">
            <Link to={"/profile/" + props.user.name}>
              <button className="overlayright">Profile</button>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

export default DmUserButton;
