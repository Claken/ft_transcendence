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
      (checkSender === chat.target.name && checkReceiver === chat.me.name) ||
      (checkSender === chat.me.name && checkReceiver === chat.target.name)
    )
      return true;
    return false;
  };

  const receiveMessage = (dm: Dm) => {
    if (dm.receiver === chat.me.name || dm.sender === chat.me.name)
      setMessages([...messages, dm]);
  };

  const modifyDmInput = (event) => {
    const input = event.currentTarget.value;
    setDmInput(input);
  };

  const enterDmInput = (sender: string, receiver: string) => {
    if (dmInput !== "") {
      const dm: Dm = { sender, receiver, message: dmInput };
      socket.emit("message_dm", dm);
      setDmInput("");
    }
  };

  useEffect(() => {
    const newSocket = io("http://localhost:3001");
    setSocket(newSocket);
  }, [setSocket]);

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`/dm/${chat.me.name}/${chat.target.name}`)
        .then((res) => {
          setMessages(res.data);
          chat.setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getData();
  }, [chat.target, chat.me]);

  useEffect(() => {
    socket?.on("message_dm", receiveMessage);
    return () => {
      socket?.off("message_dm", receiveMessage);
    };
  }, [receiveMessage]);

  return (
    <div className="dmbody">
      <div className="dmheader">{chat.target.name}</div>
      <div className="dmchat">
        {chat.loading ? (
          <p className="loadingbody">Loading...</p>
        ) : (
          <ScrollToBottom className="scroll" key={chat.target.id}>
            <div className="dmcenter">
              {messages.map((m, i) =>
                m.sender === chat.target.name ? (
                  <p className="displaydm" key={i}>
                    {m.message}
                  </p>
                ) : (
                  <p className="displaymydm" key={i}>
                    {m.message}
                  </p>
                )
              )}
            </div>
          </ScrollToBottom>
        )}
      </div>
      <div className="dminputbody">
        <input
          className="dminput"
          type="text"
          placeholder="write messages..."
          value={dmInput}
          onChange={modifyDmInput}
          onKeyPress={(event) => {
            event.key === "Enter" &&
              enterDmInput(chat.me.name, chat.target.name);
          }}
        ></input>
        <button
          className="btnsend"
          onClick={() => enterDmInput(chat.me.name, chat.target.name)}
        >
          send
        </button>
      </div>
    </div>
  );
}

export default DmChat;
