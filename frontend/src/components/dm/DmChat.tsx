import React, { useEffect, useState, useRef } from "react";
import axios from "../../axios.config";
import { Dm } from "../../interfaces/dm.interface";
import "../../styles/dmchat.css";
import { useDm } from "../../contexts/DmContext";
import DmFriendList from "./DmFriendList";
import "../../styles/chat.scss";
import "../../styles/dmchat.css";
import { IUser } from "../../interfaces/user.interface";

function DmChat() {
  const dmContext = useDm();
  const chatEndRef = useRef(null);

  const [messages, setMessages] = useState<Dm[]>([]);
  const [dmInput, setDmInput] = useState<string>("");
  const [friends, setFriends] = useState<IUser[]>([]);

  const getFriends = async () => {
    await axios
      .get(`/users/${dmContext.me.name}/friends`)
      .then((res) => {
        setFriends(res.data);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const readDm = () => {
    dmContext.socket.emit("read_dm", {
      sender: dmContext.me.name,
      receiver: dmContext.target.name,
      senderId: dmContext.me.id,
      receiverId: dmContext.target.id,
    });
  };

  const receiveMessage = (dm: Dm) => {
    if (
      (dm.senderId === dmContext.me.id &&
        dm.receiverId === dmContext.target.id) ||
      (dm.senderId === dmContext.target.id && dm.receiverId === dmContext.me.id)
    )
      setMessages([...messages, dm]);
    if (
      dm.senderId === dmContext.target.id &&
      dm.receiverId === dmContext.me.id
    )
      readDm();
    chatEndRef.current.scrollIntoView({ behavior: "smooth" });
  };

  const modifyDmInput = (event: any) => {
    const input = event.currentTarget.value;
    setDmInput(input);
  };

  const enterDmInput = (event: any) => {
    event.preventDefault();
    if (
      dmContext.target &&
      !dmContext.isBlock(dmContext.target.id) &&
      !dmContext.isBlocked(dmContext.target.id) &&
      dmInput !== ""
    ) {
      dmContext.socket.emit("message_dm", {
        sender: dmContext.me.name,
        receiver: dmContext.target.name,
        senderId: dmContext.me.id,
        receiverId: dmContext.target.id,
        message: dmInput,
        read: false,
      });
    }
    setDmInput("");
  };

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`/dm/${dmContext.me.id}/${dmContext.target.id}`)
        .then((res) => {
          setMessages(res.data);
          if (
            !dmContext.isBlock(dmContext.target.id) &&
            !dmContext.isBlocked(dmContext.target.id)
          )
            readDm();
          dmContext.setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    if (dmContext.target) getData();
  }, [dmContext.target, dmContext.me]);

  useEffect(() => {
    dmContext.socket?.on("message_dm", receiveMessage);
    return () => {
      dmContext.socket?.off("message_dm", receiveMessage);
    };
  }, [receiveMessage]);

  useEffect(() => {
    getFriends();
  }, []);

  const reloadPage = () => {
    getFriends();
  };

  useEffect(() => {
    dmContext.socket?.on("reload_user", reloadPage);
    return () => {
      dmContext.socket?.off("reload_user", reloadPage);
    };
  }, [reloadPage]);

  const switchDm = (event: any) => {
    event.preventDefault();
    dmContext.switchDm();
  };

  const nothing = (event: any) => {
    event.preventDefault();
  };

  return (
    <div className="chat-container">
      <div className="left-side">
        <div className="rooms-list"></div>
        <div className="room-buttons">
          <form onSubmit={nothing}>
            <button type="submit">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-message-plus"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M4 21v-13a3 3 0 0 1 3 -3h10a3 3 0 0 1 3 3v6a3 3 0 0 1 -3 3h-9l-4 4"></path>
                <line x1="10" y1="11" x2="14" y2="11"></line>
                <line x1="12" y1="9" x2="12" y2="13"></line>
              </svg>
            </button>
          </form>
          <form onSubmit={switchDm}>
            <button>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="icon icon-tabler icon-tabler-switch-3"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                strokeWidth="2"
                stroke="currentColor"
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                <path d="M3 17h2.397a5 5 0 0 0 4.096 -2.133l.177 -.253m3.66 -5.227l.177 -.254a5 5 0 0 1 4.096 -2.133h3.397"></path>
                <path d="M18 4l3 3l-3 3"></path>
                <path d="M3 7h2.397a5 5 0 0 1 4.096 2.133l4.014 5.734a5 5 0 0 0 4.096 2.133h3.397"></path>
                <path d="M18 20l3 -3l-3 -3"></path>
              </svg>
            </button>
          </form>
        </div>
      </div>
      {dmContext.target ? (
        <div className="middle">
          <div className="top-chat">{dmContext.target.name}</div>
          <div className="chat-box">
            {(dmContext.isBlock(dmContext.target.id) && (
              <p className="bodydmfriendlist">this user is blocked</p>
            )) ||
              (dmContext.isBlocked(dmContext.target.id) && (
                <p className="bodydmfriendlist">this user block you</p>
              )) || (
                <ul>
                  {messages.map((msg: any, id: number) => (
                    <div
                      key={id}
                      className={
                        msg.senderId == dmContext.me.id
                          ? "owner_messages"
                          : "others-messages"
                      }
                    >
                      <li key={id}>
                        <div className="sender-username">{msg.sender}</div>
                        <p>{msg.message}</p>
                        <div className="message-date">
                          {msg.date.slice(0, 10) + " " + msg.date.slice(11, 16)}
                        </div>
                      </li>
                    </div>
                  ))}
                  <li key="end">
                    <div className="endchat" ref={chatEndRef} />
                  </li>
                </ul>
              )}
          </div>
          <div className="chat-bottom">
            <div className="chat-send-msg">
              <form onSubmit={enterDmInput}>
                <input
                  type="text"
                  value={dmInput}
                  onChange={modifyDmInput}
                  placeholder="Type something ..."
                />
                <button type="submit">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="icon icon-tabler icon-tabler-brand-telegram"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    strokeWidth="2"
                    stroke="currentColor"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
                    <path d="M15 10l-4 4l6 6l4 -16l-18 7l4 2l2 6l3 -4"></path>
                  </svg>
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="middle">
          <div className="top-chat"></div>
          <div className="chat-box"></div>
          <div className="chat-bottom"></div>
        </div>
      )}
      <div className="rigth-side">
        <div className="member-list">
          <ul className="btndisplay">
            <li className="bodydmfriendlist">Friend's list</li>
            {friends.map((friend) => (
              <DmFriendList key={friend.id} user={friend} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default DmChat;
