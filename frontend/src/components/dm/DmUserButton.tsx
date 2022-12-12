import React, { useState, useEffect } from "react";
import axios from "../../axios.config";
import { Link } from "react-router-dom";
import Rouage from "../../assets/img/rouage.png";
import { useDm } from "../../contexts/DmContext";
import { Dm } from "../../interfaces/dm.interface";
import "../../styles/dmchat.css";
import UserNotFound from "../social/UserNotFound";

function DmUserButton(props) {
  const dmContext = useDm();
  const [dropDown, setDropDown] = useState(false);
  const [notifications, setNotifications] = useState<number>(0);

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

  const blockUser = (sender: number, blocked: number) => {
    dmContext.socket.emit("block_user", {
      sender,
      blocked,
    });
  };

  const deblockUser = (sender: number, blocked: number) => {
    dmContext.socket.emit("deblock_user", {
      sender,
      blocked,
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
  };

  useEffect(() => {
    getNotifications();
  }, []);

  useEffect(() => {
    dmContext.socket?.on("message_dm", incrementNotifications);
    return () => {
      dmContext.socket?.off("message_dm", incrementNotifications);
    };
  }, [incrementNotifications]);

  return (
    <li key={props.user.id}>
      <div
        className="btnbody"
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <div className="btnuser">
          <div className="nameuser">{props.user.name}</div>
          {(haveNotifications() && (
            <div className="notifications">{notifications} new message(s)</div>
          )) || <div className="notifications"></div>}
          <div className="overlayup">
            <div className="overlayupleft">
              <Link to="/channel">
                <button
                  className="simplebtn"
                  onClick={() => dmContext.changeTarget(props.user)}
                >
                  Messages
                </button>
              </Link>
            </div>
            <div className="overlayupright">
              <Link to={"/profile/" + props.user.name}>
                <button className="simplebtn">Profile</button>
              </Link>
            </div>
          </div>
          <div className="boxtourne">
            {(!dropDown && <img src={Rouage} className="tourne"></img>) || (
              <img src={Rouage} className="tourne tourneanim"></img>
            )}
          </div>
        </div>
        <div className="overlay">
          <div className="overlayleft">empty</div>
          <div className="overlaymiddle">
            <button
              className="simplebtn"
              onClick={() =>
                postRequestFriend(dmContext.me.name, props.user.name)
              }
            >
              Add friend
            </button>
          </div>
          <div className="overlayright">
            {(dmContext.blockUsers.findIndex(
              (blockUser) => blockUser.id === props.user.id
            ) === -1 && (
              <button
                className="simplebtn"
                onClick={() => blockUser(dmContext.me.id, props.user.id)}
              >
                Block user
              </button>
            )) || (
              <button
                className="simplebtn"
                onClick={() => deblockUser(dmContext.me.id, props.user.id)}
              >
                Deblock user
              </button>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

export default DmUserButton;
