import React, { useEffect, useState } from "react";
import axios from "../../axios.config";
import { Dm } from "../../interfaces/dm.interface";
import "../../styles/dmchat.css";
import ScrollToBottom from "react-scroll-to-bottom";
import { useDm } from "../../contexts/DmContext";

function DmChat() {
  const [messages, setMessages] = useState<Dm[]>([]);
  const [dmInput, setDmInput] = useState<string>("");
  const dmContext = useDm();

  const readDm = () => {
    dmContext.socket.emit("read_dm", {
      sender: dmContext.me.name,
      receiver: dmContext.target.name,
    });
    console.log("on envoit la lecture");
  };

  const receiveMessage = (dm: Dm) => {
    if (
      (dm.sender === dmContext.me.name &&
        dm.receiver === dmContext.target.name) ||
      (dm.sender === dmContext.target.name && dm.receiver === dmContext.me.name)
    )
      setMessages([...messages, dm]);
			if (dm.sender === dmContext.target.name && dm.receiver === dmContext.me.name)
				readDm();
  };

  const modifyDmInput = (event) => {
    const input = event.currentTarget.value;
    setDmInput(input);
  };

  const enterDmInput = (sender: string, receiver: string) => {
    if (dmInput !== "") {
      dmContext.socket.emit("message_dm", {
        sender,
        receiver,
        message: dmInput,
        read: false,
      });
      setDmInput("");
    }
  };

  useEffect(() => {
    const getData = async () => {
      await axios
        .get(`/dm/${dmContext.me.name}/${dmContext.target.name}`)
        .then((res) => {
          setMessages(res.data);
					readDm();
          dmContext.setLoading(false);
        })
        .catch((error) => {
          console.log(error);
        });
    };
    getData();
  }, [dmContext.target, dmContext.me]);

  useEffect(() => {
    dmContext.socket?.on("message_dm", receiveMessage);
    return () => {
      dmContext.socket?.off("message_dm", receiveMessage);
    };
  }, [receiveMessage]);

  return (
    <div className="dmbody">
      <div className="dmheader">{dmContext.target.name}</div>
      <div className="dmchat">
        {dmContext.loading ? (
          <p className="loadingbody">Loading...</p>
        ) : (
          <ScrollToBottom className="scroll" key={dmContext.target.id}>
            <div className="dmcenter">
              {messages.map((m, i) =>
                m.sender === dmContext.target.name ? (
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
              enterDmInput(dmContext.me.name, dmContext.target.name);
          }}
        ></input>
        <button
          className="btnsend"
          onClick={() => enterDmInput(dmContext.me.name, dmContext.target.name)}
        >
          send
        </button>
      </div>
    </div>
  );
}

export default DmChat;
