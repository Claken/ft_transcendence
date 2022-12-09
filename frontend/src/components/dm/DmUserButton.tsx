import React, { useState } from "react";
import { Link } from "react-router-dom";
import Rouage from "../../assets/img/rouage.png";
import "../../styles/dmchat.css";
import UserNotFound from "../social/UserNotFound";
import { useChat } from "../../contexts/ChatContext";

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

  const inviteButton = () => {
	console.log(props.user);
	console.log(chat.me);
  }

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
          <button className="overlayleft">Messages</button>
          <button className="overlaycenter" onClick={inviteButton}>Invite</button>
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
