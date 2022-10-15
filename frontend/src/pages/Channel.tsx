import React from "react";
import Navigation from "../components/Navigation";
import ProtoChat from "../components/chat/ProtoChat";
import AppTestSockets from "../components/chat/webSocketTester";

function Channel() {
  return (
    <div>
      <Navigation />
      <h1>Channel</h1>
      < ProtoChat />
      {/* < AppTestSockets /> */}
    </div>
  );
}

export default Channel;
