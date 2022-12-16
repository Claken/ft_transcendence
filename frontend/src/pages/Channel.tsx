import React from "react";
import Chat from "../components/chat/Chat";
import "../styles/chat.scss"
import { useDm } from "../contexts/DmContext";
import DmChat from "../components/dm/DmChat";

function Channel() {
  const dmContext = useDm();

  return (
    <div>
      {dmContext.openDm ? <DmChat /> : <Chat />}
    </div>
  );
}

export default Channel;
