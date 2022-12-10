import React, { useState, useEffect } from "react";
import axios from "../../axios.config";
import { Link } from "react-router-dom";
import Rouage from "../../assets/img/rouage.png";
import { useDm } from "../../contexts/DmContext";
import { Dm } from "../../interfaces/dm.interface";
import "../../styles/dmchat.css";
import UserNotFound from "../social/UserNotFound";
// import { useChat } from "../../contexts/ChatContext";

function DmUserButton(props) {
  const dmContext = useDm();
  const [dropDown, setDropDown] = useState(false);
  const [notifications, setNotifications] = useState<number>(0);
  // const chat = useChat();

  const haveNotifications = () => {
    if (notifications > 0) return true;
    return false;
  };

  const onMouseEnter = () => {
    setDropDown(true);
  };

  const onMouseLeave = () => {
    setDropDown(false);
  };

  const postRequestFriend = (sender: string, receiver: string) => {
    dmContext.socket.emit("send_friendRequest", {
      sender,
      receiver,
    });
  };

  const getNotifications = async () => {
    await axios
      .get(`/dm/${dmContext.me.name}/${props.user.name}/read`)
      .then((res) => {
        setNotifications(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

	const incrementNotifications = (dm: Dm) => {
		if (dm.sender === props.user.name && dm.receiver === dmContext.me.name)
			setNotifications(notifications + 1);
	}

  useEffect(() => {
    getNotifications();
  }, []);

	useEffect(() => {
    dmContext.socket?.on("message_dm", incrementNotifications);
    return () => {
      dmContext.socket?.off("message_dm", incrementNotifications);
    };
  }, [incrementNotifications]);

  // const inviteButton = () => {
	// console.log(props.user);
	// console.log(chat.me);
  // }

  return (
    <li key={props.user.id}>
      <div className="btnbody">
        <button
          className="btnuser"
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
        >
          <div className="nameuser">{props.user.name}</div>
          {haveNotifications() && <div className="notifications">{notifications} new message(s)</div>}
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
                className="simplebtn"
                onClick={() => dmContext.changeTarget(props.user)}
              >
                Messages
              </button>
            </Link>
          </div>
          <div className="overlaymiddle">
            <button
              className="simplebtn"
              onClick={() =>
                postRequestFriend(dmContext.me.name, props.user.name)
              }
            >
              add friend
            </button>
          </div>
          <div className="overlayright">
            <Link to={"/profile/" + props.user.name}>
              <button className="simplebtn">Profile</button>
            </Link>
          </div>
        </div>
      </div>
    </li>
  );
}

export default DmUserButton;
