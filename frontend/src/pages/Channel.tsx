import React from "react";
import Navigation from "../components/Navigation";
import ProtoChat from "../components/chat/ProtoChat";
import AppTestSockets from "../components/chat/webSocketTester";

function Channel() {
  return (
    <div>
      < ProtoChat />
      {/* < AppTestSockets /> */}
    </div>
  );
}

export default Channel;
