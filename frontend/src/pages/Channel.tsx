import React from "react";
import Navigation from "../components/Navigation";
import AppTestSockets from "../components/chat/webSocketTester";

function Channel() {
  return (
    <div>
      <Navigation />
      <h1>Channel</h1>
      <AppTestSockets />
    </div>
  );
}

export default Channel;
