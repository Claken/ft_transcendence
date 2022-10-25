import React from "react";
import ProtoChat from "../components/chat/ProtoChat";
import AppTestSockets from "../components/chat/webSocketTester";

function Channel() {
  return (
    <div>
      <h1>Channel</h1>
      < ProtoChat />
      {/* < AppTestSockets /> */}
    </div>
  );
}

export default Channel;
