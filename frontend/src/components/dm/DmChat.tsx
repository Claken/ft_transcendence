import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "axios";
import { Dm } from "../../interfaces/dm.interface";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/dmchat.css";
import ScrollToBottom from "react-scroll-to-bottom";

function DmChat(props) {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Dm[]>([]);
  const [dmInput, setDmInput] = useState<string>("");
  const auth = useAuth();

  const checkDm = (checkSender: string, checkReceiver: string): boolean => {
    if (
      (checkSender === props.user.name && checkReceiver === auth.user.name) ||
      (checkSender === auth.user.name && checkReceiver === props.user.name)
    )
      return true;
    return false;
  };

  const receiveMessage = (dm: Dm) => {
    if (checkDm(dm.sender, dm.receiver)) setMessages([...messages, dm]);
  };

  const modifyDmInput = (event) => {
    const input = event.currentTarget.value;
    setDmInput(input);
  };

  const enterDmInput = (sender: string, receiver: string) => {
    const dm: Dm = { sender, receiver, message: dmInput };
    socket?.emit("message_dm", dm);
    setDmInput("");
  };

  const historyDm = (dms: Dm[]) => {
    dms.map((dm) => {
      console.log("dm = " + dm.message);
      if (checkDm(dm.sender, dm.receiver)) setMessages([...messages, dm]);
    });
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    const getData = async () => {
      const res = await axios("http://localhost:3001/dm");
      setMessages(res.data);
    };
    getData();
  }, []);

  useEffect(() => {
    socket?.on("message_dm", receiveMessage);
    return () => {
      socket?.off("message_dm", receiveMessage);
    };
  }, [receiveMessage]);

  return (
    <div className="dmbody">
      <div className="dmheader">{props.user.name}</div>
      <div className="dmchat">
        <ScrollToBottom className="scroll" key={1}>
          <div className="dmcenter">
            {messages.map((m, i) =>
              checkDm(m.sender, m.receiver) ? (
                m.sender === props.user.name ? (
                  <p className="displaydm" key={i}>
                    {m.message}
                  </p>
                ) : (
                  <p className="displaymydm" key={i}>
                    {m.message}
                  </p>
                )
              ) : (
                <></>
              )
            )}
          </div>
        </ScrollToBottom>
      </div>
      <div className="dminput">
        <input
          type="text"
          placeholder="..."
          value={dmInput}
          onChange={modifyDmInput}
          onKeyPress={(event) => {
            event.key === "Enter" &&
              enterDmInput(auth.user.name, props.user.name);
          }}
        ></input>
        <button onClick={() => enterDmInput(auth.user.name, props.user.name)}>
          send
        </button>
      </div>
    </div>
  );
}

export default DmChat;
