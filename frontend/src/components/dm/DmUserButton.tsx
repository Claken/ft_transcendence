import React, { useState } from "react";
import { Link } from "react-router-dom";
import Rouage from "../../assets/img/rouage.png";
import "../../styles/dmchat.css";

function DmUserButton(props) {
  const [dropDown, setDropDown] = useState(false);

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
          <button className="overlayleft">
            Messages
          </button>
          <button className="overlayright">Profile</button>
        </div>
      </div>
    </li>
  );
}

export default DmUserButton;
