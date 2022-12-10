import React from "react";
import Navigation from "../components/Navigation";
import ProtoChat from "../components/chat/Chat";
import AppTestSockets from "../components/chat/webSocketTester";
import "../styles/chat.scss"

function Channel() {
  return (
    <div>
      < ProtoChat />
    </div>
  );
}

export default Channel;
