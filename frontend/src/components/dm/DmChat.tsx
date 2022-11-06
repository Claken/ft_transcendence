import React, { useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import axios from "../../axios.config";
import { Dm } from "../../interfaces/dm.interface";
import { useAuth } from "../../contexts/AuthContext";
import "../../styles/dmchat.css";
import ScrollToBottom from "react-scroll-to-bottom";
import { useChat } from "../../contexts/ChatContext";

function DmChat() {
  const [socket, setSocket] = useState<Socket>();
  const [messages, setMessages] = useState<Dm[]>([]);
  const [dmInput, setDmInput] = useState<string>("");
  const chat = useChat();

  const checkDm = (checkSender: string, checkReceiver: string): boolean => {
    if (
      (checkSender === chat.toChat.name && checkReceiver === chat.me.name) ||
      (checkSender === chat.me.name && checkReceiver === chat.toChat.name)
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

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get("/dm")
        .then((res) => {
          setMessages(res.data);
        })
        .catch((error) => {
          console.log(error);
        });
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
      <div className="dmheader">{chat.toChat.name}</div>
      <div className="dmchat">
        <ScrollToBottom className="scroll" key={chat.toChat.id}>
          <div className="dmcenter">
            {messages.map((m, i) =>
                checkDm(m.sender, m.receiver) &&
                (m.sender === chat.toChat.name ? (
                  <p className="displaydm" key={i}>
                    {m.message}
                  </p>
                ) : (
                  <p className="displaymydm" key={i}>
                    {m.message}
                  </p>
                ))
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
              enterDmInput(chat.me.name, chat.toChat.name);
          }}
        ></input>
        <button onClick={() => enterDmInput(chat.me.name, chat.toChat.name)}>
          send
        </button>
      </div>
    </div>
  );
}

export default DmChat;
