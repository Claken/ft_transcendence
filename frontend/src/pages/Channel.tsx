import React from "react";
import Navigation from "../components/Navigation";
import Chat from "../components/chat/Chat";
import AppTestSockets from "../components/chat/webSocketTester";
import "../styles/chat.scss"
import { C } from "../contexts/ChatContext";

function Channel() {
  return (
    <div>
      < Chat />
    </div>
  );
}

export default Channel;
