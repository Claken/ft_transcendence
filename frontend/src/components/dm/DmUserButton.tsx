import React, { useState, useEffect } from "react";
import axios from "../../axios.config";
import { Link } from "react-router-dom";
import Rouage from "../../assets/img/rouage.png";
import { useDm } from "../../contexts/DmContext";
import { Dm } from "../../interfaces/dm.interface";
import "../../styles/dmchat.css";

function DmUserButton(props) {
  const dmContext = useDm();
  const [dropDown, setDropDown] = useState(false);
  const [notifications, setNotifications] = useState<number>(0);

  const isConnect = (user): boolean => {
    if (user.status === "online") return true;
    return false;
  };

	const haveNotifications = () => {
		if (notifications)
			return true;
		return false;
	}

	const incrementeNotifications = (dm: Dm) => {
		if (dm.sender === props.user.name)
			setNotifications(notifications + 1);
	}

  const onMouseEnter = () => {
    setDropDown(true);
  };

  const onMouseLeave = () => {
    setDropDown(false);
  };

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`/dm/${dmContext.me.name}/${props.user.name}/read`)
        .then((res) => {
          setNotifications(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getData();
  }, []);

  useEffect(() => {
    dmContext.socket?.on("message_dm", incrementeNotifications);
    return () => {
      dmContext.socket?.off("message_dm", incrementeNotifications);
    };
  }, [incrementeNotifications]);

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
          {haveNotifications() && (
            <div className="notifications">{notifications} new message(s)</div>
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
              <button
                className="overlayleft"
                onClick={() => dmContext.changeTarget(props.user)}
              >
                Messages
              </button>
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
