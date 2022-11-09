import React from "react";
import DmList from "../components/dm/DmList";
import DmChat from "../components/dm/DmChat";
import { useChat } from "../contexts/ChatContext";
import "../styles/page.css";

function Social() {
  const chat = useChat();

  return (
    <div className="socialbody">
      <div className="socialbody-left">
        <DmList />
      </div>
      <div className="socialbody-right">{chat.haveTarget && <DmChat />}</div>
    </div>
  );
}

export default Social;
